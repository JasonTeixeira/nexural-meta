# Playbook: Migrate Between Vector DBs

> **Trigger:** You need to move your embeddings from one vector DB to another
> without downtime. Common migrations: Pinecone → Qdrant (cost), pgvector → Turbopuffer
> (multi-tenant isolation), Chroma → pgvector (production hardening).

---

## When to Migrate (3 Real Triggers)

### Trigger 1: Cost shock at scale

You've grown past the inflection point where a managed service becomes expensive
relative to alternatives. Common thresholds:

```
Pinecone: > $200/mo → evaluate Qdrant self-hosted (same indexing quality at ~$25/mo on Fly.io)
Pinecone: > $500/mo → Qdrant self-hosted almost certainly pays back within 2 months
pgvector: > 50M chunks → query latency degrades; migrate to Qdrant for better ANN indexing
Turbopuffer: high read-heavy load → per-query cost adds up; evaluate Qdrant at steady-state
```

**Don't migrate on price alone before you've measured.** Run both for a week and
compare actual latency at your query volume.

### Trigger 2: Missing capability you can't bolt on

| You need                        | Current          | Why you need to migrate                                       |
| ------------------------------- | ---------------- | ------------------------------------------------------------- |
| Hybrid search (dense + BM25)    | pgvector         | pg_trgm isn't BM25; Qdrant/Weaviate have native hybrid        |
| Multi-tenant isolation at scale | Pinecone         | Metadata filter works but namespace limits hurt large tenants |
| Knowledge graph traversal       | Qdrant           | Qdrant has no graph layer; consider Weaviate or LightRAG      |
| HIPAA BAA                       | Pinecone managed | No BAA available; need self-hosted solution                   |
| Zero idle cost per tiny tenant  | Qdrant           | Turbopuffer is S3-backed, no idle cost per namespace          |

### Trigger 3: Infra complexity you can't maintain

Your team runs a 3-node Weaviate cluster and nobody remembers how it was set up.
A single Qdrant node in Docker with backups is worth the migration cost.

**Never migrate just because a new vector DB showed up in a benchmark.**
Benchmarks are synthetic. Your query pattern + data distribution + team ops
capacity matter more than peak benchmark throughput.

---

## The 4-Step Migration Pattern

### Overview

```
Step 1: DUAL-WRITE   — new writes go to both old and new DB
Step 2: BACKFILL     — copy existing data from old to new
Step 3: VERIFY       — confirm data integrity and recall quality
Step 4: CUTOVER      — flip reads to new DB, stop writing to old
```

This pattern provides:

- **Zero downtime:** reads stay on old DB until you cutover
- **Rollback:** if something goes wrong in steps 2-3, just keep reading from old
- **Confidence:** you verify before you commit

Total migration window: 1-7 days for most production datasets.

---

### Step 1: Dual-Write

Add an abstraction layer that writes to both DBs simultaneously. This is cheap
to implement and buys you a clean rollback path.

```python
# vector_store.py — dual-write wrapper

import asyncio
from typing import Protocol

class VectorStore(Protocol):
    async def upsert(self, id: str, vector: list[float], payload: dict) -> None: ...
    async def search(self, vector: list[float], limit: int, filter: dict) -> list[dict]: ...
    async def delete(self, id: str) -> None: ...


class DualWriteVectorStore:
    """Writes to both primary (reads) and secondary (new, backfilling).
    Reads always come from primary until cutover flag is flipped."""

    def __init__(
        self,
        primary: VectorStore,
        secondary: VectorStore,
        cutover: bool = False,
    ):
        self.primary = primary
        self.secondary = secondary
        self.cutover = cutover  # flip to True for cutover

    async def upsert(self, id: str, vector: list[float], payload: dict) -> None:
        # Write to both, don't fail if secondary fails
        tasks = [self.primary.upsert(id, vector, payload)]
        if self.secondary:
            tasks.append(self._safe_secondary_upsert(id, vector, payload))
        await asyncio.gather(*tasks)

    async def _safe_secondary_upsert(self, id: str, vector: list[float], payload: dict):
        try:
            await self.secondary.upsert(id, vector, payload)
        except Exception as e:
            # Log but don't raise — secondary failures must not break primary
            logger.error(f"Secondary upsert failed for {id}: {e}")

    async def search(self, vector: list[float], limit: int, filter: dict = None) -> list[dict]:
        if self.cutover:
            return await self.secondary.search(vector, limit, filter)
        return await self.primary.search(vector, limit, filter)

    async def delete(self, id: str) -> None:
        await self.primary.delete(id)
        if self.secondary:
            await self._safe_secondary_delete(id)

    async def _safe_secondary_delete(self, id: str):
        try:
            await self.secondary.delete(id)
        except Exception as e:
            logger.error(f"Secondary delete failed for {id}: {e}")
```

Deploy with `cutover=False`. All new writes now go to both DBs. Existing data
still needs to be backfilled (Step 2).

---

### Step 2: Backfill (Idempotent Migration Script)

The backfill script copies all existing data from old DB to new DB.
**It must be idempotent** — safe to run multiple times without duplicating data.

```python
# scripts/migrate_vectors.py

import asyncio
import json
import logging
from pathlib import Path
from datetime import datetime

logger = logging.getLogger(__name__)

CHECKPOINT_FILE = Path("migration_checkpoint.json")
BATCH_SIZE = 1000  # tune based on memory + API rate limits


def load_checkpoint() -> dict:
    """Load progress so we can resume after interruption."""
    if CHECKPOINT_FILE.exists():
        return json.loads(CHECKPOINT_FILE.read_text())
    return {"last_offset": 0, "migrated_count": 0, "errors": []}


def save_checkpoint(checkpoint: dict):
    CHECKPOINT_FILE.write_text(json.dumps(checkpoint, indent=2))


async def migrate_batch(
    source: VectorStore,
    dest: VectorStore,
    offset: int,
    batch_size: int,
) -> tuple[int, list[str]]:
    """Returns (count_migrated, list_of_error_ids)."""

    # Fetch batch from source
    batch = await source.scroll(offset=offset, limit=batch_size)
    if not batch:
        return 0, []

    errors = []
    migrated = 0

    for record in batch:
        try:
            # Upsert is idempotent — safe to re-run
            await dest.upsert(
                id=record["id"],
                vector=record["vector"],
                payload=record["payload"],
            )
            migrated += 1
        except Exception as e:
            logger.error(f"Failed to migrate {record['id']}: {e}")
            errors.append(record["id"])

    return migrated, errors


async def run_migration(source: VectorStore, dest: VectorStore):
    checkpoint = load_checkpoint()
    offset = checkpoint["last_offset"]
    total_migrated = checkpoint["migrated_count"]

    logger.info(f"Starting migration from offset {offset} ({total_migrated} already done)")

    while True:
        count, errors = await migrate_batch(source, dest, offset, BATCH_SIZE)

        if count == 0:
            logger.info(f"Migration complete. Total: {total_migrated}")
            break

        total_migrated += count
        offset += BATCH_SIZE
        checkpoint["last_offset"] = offset
        checkpoint["migrated_count"] = total_migrated
        checkpoint["errors"].extend(errors)
        save_checkpoint(checkpoint)

        logger.info(f"Migrated {total_migrated} records (offset {offset})")

        # Rate limit if needed
        await asyncio.sleep(0.1)

    # Retry errors
    if checkpoint["errors"]:
        logger.warning(f"{len(checkpoint['errors'])} records failed, retrying...")
        for record_id in checkpoint["errors"]:
            record = await source.get(record_id)
            if record:
                await dest.upsert(record["id"], record["vector"], record["payload"])

    save_checkpoint(checkpoint)


# Run:
# python scripts/migrate_vectors.py
# Re-run after interruption: picks up from checkpoint automatically
```

**Rate limiting:** If your source DB has API rate limits (Pinecone: 100 req/s),
add `asyncio.sleep(0.01)` between batches. Self-hosted DBs (Qdrant) can typically
handle bulk upserts at 10k records/s.

---

### Step 3: Verify

Before cutover, verify two things: (1) data completeness, (2) retrieval quality.

#### Verify 1: Random sample integrity check

```python
import random

async def verify_sample(source: VectorStore, dest: VectorStore, sample_size: int = 200):
    """Check that sampled records exist in dest with matching payload."""

    # Get random IDs from source
    all_ids = await source.list_ids()
    sample_ids = random.sample(all_ids, min(sample_size, len(all_ids)))

    missing = []
    mismatched = []

    for id in sample_ids:
        src_record = await source.get(id)
        dst_record = await dest.get(id)

        if dst_record is None:
            missing.append(id)
            continue

        # Check payload matches (don't compare vectors — floating point drift is OK)
        if src_record["payload"] != dst_record["payload"]:
            mismatched.append({"id": id, "src": src_record["payload"], "dst": dst_record["payload"]})

    print(f"Sample verification: {sample_size} records")
    print(f"  Missing in dest:    {len(missing)}")
    print(f"  Payload mismatches: {len(mismatched)}")

    # Fail if >1% missing or mismatched
    if (len(missing) + len(mismatched)) / sample_size > 0.01:
        raise AssertionError("Verification failed: too many discrepancies")

    return len(missing) == 0 and len(mismatched) == 0
```

#### Verify 2: Recall@K on holdout set

This is the critical test: do queries return the same (or better) results?

```python
async def verify_recall_at_k(
    source: VectorStore,
    dest: VectorStore,
    query_vectors: list[list[float]],
    k: int = 10,
) -> float:
    """
    Measures what fraction of top-K results from source appear in top-K from dest.
    A score of 0.95 means 95% of results match — acceptable for most use cases.
    Target: >0.90 for same embedding model; >0.95 before cutover.
    """

    recall_scores = []

    for query_vec in query_vectors:
        src_results = await source.search(query_vec, limit=k)
        dst_results = await dest.search(query_vec, limit=k)

        src_ids = {r["id"] for r in src_results}
        dst_ids = {r["id"] for r in dst_results}

        overlap = src_ids & dst_ids
        recall = len(overlap) / k
        recall_scores.append(recall)

    avg_recall = sum(recall_scores) / len(recall_scores)
    print(f"Recall@{k}: {avg_recall:.3f} over {len(query_vectors)} queries")
    return avg_recall


# Your holdout query set: 50-100 representative queries from production logs
query_vectors = [embed(q) for q in HOLDOUT_QUERIES]
recall = await verify_recall_at_k(source_db, dest_db, query_vectors, k=10)

if recall < 0.90:
    raise AssertionError(f"Recall too low ({recall:.2%}), do not cutover")
```

**What's an acceptable recall@K drop?**

- Same embedding model: expect >0.98 (only indexing differences)
- Different embedding model: expect 0.85-0.95 depending on model quality delta

If recall is unexpectedly low, check:

1. Index parameters (HNSW ef_construction, m) — different defaults across DBs
2. Distance metric mismatch (Cosine vs Dot Product vs Euclidean)
3. Normalization: some DBs auto-normalize, others don't

---

### Step 4: Cutover

Once verification passes, flip the read switch.

```python
# Production cutover: flip the flag
store = DualWriteVectorStore(
    primary=pinecone_store,
    secondary=qdrant_store,
    cutover=True,   # ← flip this
)

# Or: via environment variable for zero-redeploy cutover
import os
cutover = os.getenv("VECTOR_DB_CUTOVER", "false").lower() == "true"
store = DualWriteVectorStore(primary=old, secondary=new, cutover=cutover)
```

```bash
# Set env var in Railway/Fly.io/K8s — triggers rolling restart
VECTOR_DB_CUTOVER=true

# Monitor for 24 hours. Check:
# - Query latency percentiles (should be same or better)
# - Error rate (should be 0)
# - Result quality (check with human review if possible)
```

After 7 days of stable operation: remove dual-write code, tear down old DB.

---

## Re-Embedding Decision: Do You Need To?

**Almost always: no.**

Your existing embedding vectors are valid as long as:

1. You're not changing embedding models
2. You're not changing the chunking strategy

The vectors don't care which database holds them. You're just moving binary blobs.

**When you DO need to re-embed:**

- Switching embedding models (e.g., OpenAI text-embedding-ada-002 → Voyage voyage-3-large)
- Changing chunk size significantly (500 tokens → 2000 tokens)
- Adding metadata that changes semantic meaning of the chunk

**Re-embedding cost estimate:**

```
10M chunks × 512 dimensions × 4 bytes = ~20GB (storage cost only)
Re-embedding 10M chunks with text-embedding-3-small: ~$0.20
Re-embedding 10M chunks with Voyage voyage-3-large:  ~$0.30
```

Re-embedding is cheap. The expensive part is compute time and the dual-write
window you have to run longer. If you're re-embedding, extend your dual-write
period to ensure all re-embedded data is backfilled before cutover.

---

## Rollback Plan

```
If verification fails in Step 3:
  → Keep cutover=False, stay on old DB
  → Fix the issue (missed backfill, wrong index params)
  → Re-run verify from Step 3

If production issues appear after cutover:
  → Flip cutover=False (reads back to old DB)
  → Old DB is still receiving writes (dual-write still running)
  → Zero data loss, full rollback in <5 minutes

After rollback:
  → Investigate: was it index params? Incorrect payload mapping?
  → Fix and re-verify before attempting cutover again
```

**Keep dual-write running for 7 days post-cutover** before removing it.
This ensures you have a clean rollback option for the first week.

---

## Cost During Migration

You're paying for both databases for 1-7 days. Budget for it.

```
Example: Pinecone → Qdrant Cloud migration

Old (Pinecone s1.x1):    $70/mo = $2.30/day
New (Qdrant Cloud 1CPU): $25/mo = $0.82/day

Dual-write window (5 days):
  Pinecone: 5 × $2.30 = $11.50
  Qdrant:   5 × $0.82 = $4.10
  Total extra cost: ~$16 (one-time)

Ongoing savings after cutover: $45/mo
Break-even: <1 month
```

Don't rush cutover to avoid this cost. The risk of premature cutover
(data integrity issues, recall regression) costs far more than a few extra days.

---

## Common Migration Pitfalls

**Distance metric mismatch**: Pinecone cosine ≠ Qdrant dot product. Check your
current metric and set the new DB to match exactly. Switching distance metrics
silently changes result ordering.

**Missing payload indexes**: Qdrant requires explicit index creation for filter-heavy
queries. If you have metadata filters in production, create the payload indexes
before cutover or your first filtered queries will be slow (full scan).

```python
# Create payload indexes in Qdrant before cutover
from qdrant_client import QdrantClient
from qdrant_client.models import PayloadSchemaType

client = QdrantClient(url=QDRANT_URL)
client.create_payload_index(
    collection_name="my_collection",
    field_name="tenant_id",
    field_schema=PayloadSchemaType.KEYWORD,
)
client.create_payload_index(
    collection_name="my_collection",
    field_name="created_at",
    field_schema=PayloadSchemaType.DATETIME,
)
```

**HNSW parameter mismatch**: Different defaults for `ef_construction` and `m`
across DBs affect recall and indexing speed. Match parameters to your old DB or
tune from scratch.

```python
# Qdrant: explicit HNSW config to match Pinecone quality
from qdrant_client.models import HnswConfigDiff

client.update_collection(
    collection_name="my_collection",
    hnsw_config=HnswConfigDiff(m=16, ef_construct=100),
)
```

---

## Related Warehouse Entries

- [qdrant] — most common migration destination; see Qdrant docs for bulk upload API
- [pgvector] — common migration source or destination for small-scale apps
- [pinecone] — common migration source when cost becomes the trigger
- [turbopuffer] — destination for multi-tenant SaaS with many small tenants
