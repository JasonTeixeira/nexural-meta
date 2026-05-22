import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runFederationConformance } from "../src/federation-conformance.js";

describe("runFederationConformance", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "qa-fc-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("fails when no lockfile present", async () => {
    const r = await runFederationConformance({ cwd: dir });
    expect(r.passed).toBe(false);
    expect(r.findings[0]!.rule).toBe("lockfile-presence");
  });

  it("passes for a complete valid lockfile", async () => {
    mkdirSync(join(dir, ".nexural"), { recursive: true });
    writeFileSync(
      join(dir, ".nexural/forged.lock.yaml"),
      `schema_version: 1
forged_at: 2026-05-22T15:00:00Z
forged_by_nx_version: 0.1.0
recipe:
  name: saas-multitenant-baseline
  version: 0.1.0
  sha: abc123
  signature: MEUCIQ
  provenance: https://github.com/x/y/attestations/1
warehouses_consumed:
  - name: auth
    sha: def456
sbom_hash: f00d
inputs:
  tenant_routing: subdomain
model_families_used:
  - anthropic:opus
`,
      "utf8",
    );
    const r = await runFederationConformance({ cwd: dir });
    expect(r.passed).toBe(true);
    expect(r.score).toBe(100);
  });

  it("flags missing signature as critical", async () => {
    mkdirSync(join(dir, ".nexural"), { recursive: true });
    writeFileSync(
      join(dir, ".nexural/forged.lock.yaml"),
      `schema_version: 1
forged_at: 2026-05-22T15:00:00Z
forged_by_nx_version: 0.1.0
recipe:
  name: x
  version: 0.1.0
  sha: abc
  provenance: https://github.com/x/y/attestations/1
warehouses_consumed:
  - name: auth
sbom_hash: f00d
`,
      "utf8",
    );
    const r = await runFederationConformance({ cwd: dir });
    expect(r.passed).toBe(false);
    expect(
      r.findings.some((f) => f.rule === "recipe-signature-present" && f.severity === "critical"),
    ).toBe(true);
  });

  it("flags missing provenance as critical", async () => {
    mkdirSync(join(dir, ".nexural"), { recursive: true });
    writeFileSync(
      join(dir, ".nexural/forged.lock.yaml"),
      `schema_version: 1
forged_at: 2026-05-22T15:00:00Z
forged_by_nx_version: 0.1.0
recipe:
  name: x
  version: 0.1.0
  sha: abc
  signature: MEUCIQ
warehouses_consumed:
  - name: auth
sbom_hash: f00d
`,
      "utf8",
    );
    const r = await runFederationConformance({ cwd: dir });
    expect(r.findings.some((f) => f.rule === "recipe-provenance-present")).toBe(true);
  });

  it("returns runner metadata", async () => {
    const r = await runFederationConformance({ cwd: dir });
    expect(r.runner).toBe("federation-conformance");
    expect(typeof r.duration_ms).toBe("number");
  });
});
