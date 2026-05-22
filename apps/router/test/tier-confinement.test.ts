import { describe, expect, it } from "vitest";
import { enforceTierConfinement, filterEndpointsForScope } from "../src/tier-confinement.js";
import type { CitedSnippet } from "../src/envelope.js";
import type { RouterEndpoint } from "../src/registry.js";

const factoryWh: RouterEndpoint = {
  kind: "warehouse",
  name: "auth",
  federation: "factory",
  repo: "https://github.com/x/auth-warehouse",
  tier: "internal",
  tool_prefix: "auth",
};

const lifeopsWh: RouterEndpoint = {
  kind: "warehouse",
  name: "decision",
  federation: "lifeops",
  repo: "https://github.com/x/decision-warehouse",
  tier: "private-encrypted",
  tool_prefix: "decision",
};

describe("filterEndpointsForScope", () => {
  it("passes all endpoints in both mode", () => {
    const r = filterEndpointsForScope([factoryWh, lifeopsWh], "both");
    expect(r.allowed).toHaveLength(2);
    expect(r.rejected).toHaveLength(0);
  });

  it("filters to factory only", () => {
    const r = filterEndpointsForScope([factoryWh, lifeopsWh], "factory");
    expect(r.allowed).toHaveLength(1);
    expect(r.allowed[0]!.federation).toBe("factory");
    expect(r.rejected).toHaveLength(1);
  });

  it("filters to lifeops only", () => {
    const r = filterEndpointsForScope([factoryWh, lifeopsWh], "lifeops");
    expect(r.allowed).toHaveLength(1);
    expect(r.allowed[0]!.federation).toBe("lifeops");
  });
});

describe("enforceTierConfinement", () => {
  function s(federation: "factory" | "lifeops") {
    const snip: CitedSnippet & { federation: "factory" | "lifeops" } = {
      warehouse: "x",
      id: "y",
      content: "z",
      relevance: 0.5,
      tokens: 10,
      federation,
    };
    return snip;
  }

  it("passes everything in both mode", () => {
    const r = enforceTierConfinement([s("factory"), s("lifeops")], "both");
    expect(r.passed).toHaveLength(2);
    expect(r.violations).toHaveLength(0);
  });

  it("rejects lifeops content under factory scope", () => {
    const r = enforceTierConfinement([s("factory"), s("lifeops")], "factory");
    expect(r.passed).toHaveLength(1);
    expect(r.violations).toHaveLength(1);
    expect(r.violations[0]!.reason).toMatch(/lifeops.*leaked.*factory/);
  });

  it("rejects factory content under lifeops scope", () => {
    const r = enforceTierConfinement([s("factory"), s("lifeops")], "lifeops");
    expect(r.passed).toHaveLength(1);
    expect(r.violations).toHaveLength(1);
  });
});
