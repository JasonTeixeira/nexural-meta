import { describe, expect, it } from "vitest";
import { checkDecay } from "../src/decay.js";

const FIXED_NOW = Date.parse("2026-05-22T00:00:00Z");

describe("checkDecay", () => {
  it("fresh when within 1× decay rate", () => {
    // reviewed 30 days ago, decay rate 90 → 0.33×
    const r = checkDecay("2026-04-22", 90, FIXED_NOW);
    expect(r.status).toBe("fresh");
    expect(r.daysSinceReview).toBe(30);
    expect(r.multiplier).toBeCloseTo(30 / 90, 3);
  });

  it("stale at 1.5× decay rate", () => {
    // reviewed 135 days ago, decay 90 → 1.5×
    const r = checkDecay("2026-01-07", 90, FIXED_NOW);
    expect(r.status).toBe("stale");
  });

  it("quarantined at 2.5× decay rate", () => {
    // reviewed 225 days ago, decay 90 → 2.5×
    const r = checkDecay("2025-10-09", 90, FIXED_NOW);
    expect(r.status).toBe("quarantined");
  });

  it("auto-deprecate at > 3× decay rate", () => {
    // reviewed 365 days ago, decay 90 → 4×
    const r = checkDecay("2025-05-22", 90, FIXED_NOW);
    expect(r.status).toBe("auto-deprecate");
  });

  it("fresh on the boundary (1×)", () => {
    // exactly 90 days ago, decay 90 → 1×
    const r = checkDecay("2026-02-21", 90, FIXED_NOW);
    expect(r.status).toBe("fresh");
  });

  it("throws on invalid date", () => {
    expect(() => checkDecay("not-a-date", 90, FIXED_NOW)).toThrow();
  });
});
