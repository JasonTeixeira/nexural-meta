import { describe, expect, it } from "vitest";
import { detectTyposquats, HIGH_PRIORITY_PACKAGES, levenshtein } from "../src/typosquat.js";

describe("levenshtein", () => {
  it("returns 0 for identical", () => {
    expect(levenshtein("abc", "abc")).toBe(0);
  });
  it("counts insertions", () => {
    expect(levenshtein("abc", "abcd")).toBe(1);
  });
  it("counts deletions", () => {
    expect(levenshtein("abcd", "abc")).toBe(1);
  });
  it("counts substitutions", () => {
    expect(levenshtein("abc", "abd")).toBe(1);
  });
  it("returns length when other is empty", () => {
    expect(levenshtein("abc", "")).toBe(3);
    expect(levenshtein("", "abc")).toBe(3);
  });
  it("symmetric (both lengths > 0)", () => {
    expect(levenshtein("kitten", "sitting")).toBe(3);
    expect(levenshtein("sitting", "kitten")).toBe(3);
  });
});

describe("detectTyposquats", () => {
  it("flags single-char insertion of common pkg name", () => {
    const hits = detectTyposquats(["reacti"]); // react + i
    expect(hits.some((h) => h.knownTarget === "react")).toBe(true);
  });

  it("flags single-char substitution", () => {
    const hits = detectTyposquats(["jodash"]); // lodash with j
    expect(hits.some((h) => h.knownTarget === "lodash")).toBe(true);
  });

  it("flags two-char distance by default", () => {
    const hits = detectTyposquats(["axioss"]); // axios + ss
    expect(hits.some((h) => h.knownTarget === "axios")).toBe(true);
  });

  it("does NOT flag exact matches (legitimate use)", () => {
    const hits = detectTyposquats(["react", "lodash", "next"]);
    const exactHits = hits.filter((h) => h.suspectName === h.knownTarget);
    expect(exactHits).toHaveLength(0);
  });

  it("does NOT flag distant names", () => {
    const hits = detectTyposquats(["completely-unrelated-pkg"]);
    expect(hits).toEqual([]);
  });

  it("respects maxDistance=1", () => {
    // axioss vs axios = 1 char; vs axiosss = 2 chars
    const hits1 = detectTyposquats(["axiosss"], { maxDistance: 1 });
    expect(hits1.some((h) => h.knownTarget === "axios")).toBe(false);
    const hits2 = detectTyposquats(["axiosss"], { maxDistance: 2 });
    expect(hits2.some((h) => h.knownTarget === "axios")).toBe(true);
  });

  it("supports custom knownTargets", () => {
    const hits = detectTyposquats(["mypkgg"], {
      knownTargets: ["mypkg"],
      maxDistance: 1,
    });
    expect(hits).toHaveLength(1);
  });

  it("HIGH_PRIORITY_PACKAGES includes core targets", () => {
    expect(HIGH_PRIORITY_PACKAGES).toContain("react");
    expect(HIGH_PRIORITY_PACKAGES).toContain("next");
    expect(HIGH_PRIORITY_PACKAGES).toContain("@anthropic-ai/sdk");
    expect(HIGH_PRIORITY_PACKAGES).toContain("stripe");
  });
});
