import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { collectDocs } from "../src/collector.js";

let root: string;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "ask-collector-"));
});
afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

function w(p: string, body: string): void {
  const full = join(root, p);
  mkdirSync(join(full, ".."), { recursive: true });
  writeFileSync(full, body);
}

describe("collectDocs", () => {
  it("returns empty when nothing exists", () => {
    expect(collectDocs({ root })).toEqual([]);
  });

  it("collects constitution docs from docs/*.md", () => {
    w("docs/ARCHITECTURE.md", "# Architecture\n\nbody");
    w("docs/NAMING.md", "# Naming\n\nbody");
    const docs = collectDocs({ root, include: ["constitution"] });
    const titles = docs.map((d) => d.title).sort();
    expect(titles).toEqual(["Architecture", "Naming"]);
    expect(docs.every((d) => d.kind === "constitution")).toBe(true);
  });

  it("collects ADRs from docs/adr/*.md", () => {
    w("docs/adr/0011-vertical-slice.md", "# ADR-0011\n\nthe slice");
    w("docs/adr/0012-federation-v1.md", "# ADR-0012\n\nv1.0");
    const docs = collectDocs({ root, include: ["adr"] });
    expect(docs).toHaveLength(2);
    expect(docs.every((d) => d.kind === "adr")).toBe(true);
    expect(docs.every((d) => d.source.startsWith("adr:"))).toBe(true);
  });

  it("collects warehouse documents", () => {
    w("warehouses/auth/documents/supabase-ssr.md", "# Supabase SSR\n\nbody");
    w("warehouses/auth/documents/cookies.md", "# Cookies\n\nbody");
    w("warehouses/database/documents/rls.md", "# RLS\n\nbody");
    const docs = collectDocs({ root, include: ["warehouse-doc"] });
    expect(docs).toHaveLength(3);
    const sources = docs.map((d) => d.source).sort();
    expect(sources).toEqual([
      "warehouse:auth:cookies",
      "warehouse:auth:supabase-ssr",
      "warehouse:database:rls",
    ]);
  });

  it("collects recipe THREAT_MODEL + DECISIONS + README", () => {
    w("recipes/saas-rag-chat/THREAT_MODEL.md", "# Threats\n\nbody");
    w("recipes/saas-rag-chat/DECISIONS.md", "# Decisions\n\nbody");
    w("recipes/saas-rag-chat/README.md", "# Recipe README\n\nbody");
    const docs = collectDocs({ root, include: ["recipe-doc"] });
    expect(docs).toHaveLength(3);
    expect(docs.every((d) => d.source.startsWith("recipe:saas-rag-chat:"))).toBe(true);
  });

  it("collects eval sets", () => {
    w("recipes/saas-rag-chat/templates/eval/golden-set.json.template", `{"items":[{"id":"x"}]}`);
    const docs = collectDocs({ root, include: ["eval"] });
    expect(docs).toHaveLength(1);
    expect(docs[0]?.kind).toBe("eval");
  });

  it("extracts H1 title or falls back to filename stem", () => {
    w("docs/UNTITLED.md", "no heading at all");
    w("docs/WithTitle.md", "# Real Title\n\nbody");
    const docs = collectDocs({ root, include: ["constitution"] });
    const m = new Map(docs.map((d) => [d.title, d.path]));
    expect(m.get("Real Title")).toBeDefined();
    expect(m.get("UNTITLED")).toBeDefined();
  });

  it("skips files over maxBytes", () => {
    w("docs/HUGE.md", "x".repeat(2000));
    const docs = collectDocs({ root, include: ["constitution"], maxBytes: 1000 });
    expect(docs).toHaveLength(0);
  });

  it("collects everything when include unspecified", () => {
    w("docs/A.md", "# A");
    w("docs/adr/0001.md", "# adr");
    w("warehouses/x/documents/d.md", "# d");
    w("recipes/r/README.md", "# r");
    const docs = collectDocs({ root });
    expect(docs.length).toBeGreaterThanOrEqual(4);
  });
});
