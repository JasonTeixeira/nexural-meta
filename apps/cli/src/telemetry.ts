/**
 * Telemetry — per SCHEMA_CHARTER §4.5 (privacy rule).
 *
 * Args are hashed (sha256); raw arg strings NEVER stored.
 * SQLite single-file at $NEXURAL_HOME/telemetry.db.
 *
 * Telemetry can be disabled entirely via NEXURAL_NO_TELEMETRY=1.
 */

import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { hostname } from "node:os";
import { join } from "node:path";
import { sha256Hex } from "@nexural/sdk";
import type { NexuralConfig } from "./config.js";

type DbHandle = ReturnType<typeof Database>;

let db: DbHandle | null = null;

export function openTelemetry(config: NexuralConfig): DbHandle | null {
  if (process.env.NEXURAL_NO_TELEMETRY === "1") return null;
  if (config.telemetry_destination === "none") return null;
  if (db) return db;

  if (!existsSync(config.nexural_home)) {
    mkdirSync(config.nexural_home, { recursive: true });
  }
  const dbPath = join(config.nexural_home, "telemetry.db");
  db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      event_id TEXT PRIMARY KEY,
      kind TEXT NOT NULL,
      ts TEXT NOT NULL,
      host TEXT NOT NULL,
      process TEXT NOT NULL,
      command TEXT,
      args_hash TEXT,
      latency_ms INTEGER,
      exit_code INTEGER,
      session_id TEXT,
      payload_json TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_events_kind ON events(kind);
    CREATE INDEX IF NOT EXISTS idx_events_ts ON events(ts);
  `);
  return db;
}

/**
 * Convert a Crockford-base32 monotonic-ish ID from a UUIDv7-like seed.
 * For full ULID generation we'd use the `ulid` package; for v0.1.0 we use
 * a UUIDv4 transcoded to base32 length 26 (sufficient for uniqueness;
 * sortability comes in a later patch).
 */
function newEventId(): string {
  const uuid = randomUUID().replace(/-/g, "");
  // Map to Crockford alphabet (no I, L, O, U)
  const map = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  let out = "";
  for (let i = 0; i < 26; i++) {
    const byte = parseInt(uuid.slice(i, i + 1), 16);
    out += map[byte % map.length] ?? "0";
  }
  return out;
}

export function logNxCommand(params: {
  command: string;
  args: ReadonlyArray<string>;
  latencyMs: number;
  exitCode: number;
  sessionId?: string;
}): void {
  if (!db) return;
  const eventId = newEventId();
  const argsString = params.args.join(" ");
  db.prepare(
    `INSERT INTO events
       (event_id, kind, ts, host, process, command, args_hash, latency_ms, exit_code, session_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    eventId,
    "nx_command",
    new Date().toISOString(),
    hostname(),
    "nx",
    params.command,
    sha256Hex(argsString),
    params.latencyMs,
    params.exitCode,
    params.sessionId ?? null,
  );
}

export function closeTelemetry(): void {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * Run a function and log its result as an `nx_command` event.
 */
export async function withTelemetry<T>(
  config: NexuralConfig,
  command: string,
  args: ReadonlyArray<string>,
  fn: () => Promise<T>,
): Promise<T> {
  openTelemetry(config);
  const start = Date.now();
  let exitCode = 0;
  try {
    const result = await fn();
    return result;
  } catch (e) {
    exitCode = 1;
    throw e;
  } finally {
    const latencyMs = Date.now() - start;
    logNxCommand({ command, args: [...args], latencyMs, exitCode });
  }
}
