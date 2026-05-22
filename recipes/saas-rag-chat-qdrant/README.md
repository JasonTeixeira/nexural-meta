# Recipe — `saas-rag-chat-qdrant`

Qdrant primary escape variant of `saas-rag-chat`. Per ADR-0008 §6.

## When to use

- Chunk count > 1M (pgvector practical ceiling)
- Sub-100ms p99 vector search at scale
- Tenant count > 10k (use `filter-by-payload` isolation mode)

## Inherits

Everything from `saas-rag-chat` except the vector store. Read its docs first.

## Forge

```bash
nx forge saas-rag-chat-qdrant my-rag \
  --displayName "My RAG @ Scale" \
  --rootDomain my-rag.com \
  --qdrantUrl https://my-cluster.qdrant.io \
  --qdrantTenantIsolation collection-per-tenant
```

## License

MIT.
