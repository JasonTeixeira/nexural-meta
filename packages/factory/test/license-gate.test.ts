import { describe, expect, it } from "vitest";
import { runLicenseGate } from "../src/license-gate.js";

describe("runLicenseGate", () => {
  it("passes when all deps are allowed", () => {
    const r = runLicenseGate([
      { name: "react", version: "19.0.0", license: "MIT" },
      { name: "express", version: "5.0.0", license: "MIT" },
      { name: "@anthropic-ai/sdk", version: "0.40.0", license: "MIT" },
    ]);
    expect(r.passed).toBe(true);
    expect(r.failures).toHaveLength(0);
  });

  it("fails on GPL-3.0", () => {
    const r = runLicenseGate([{ name: "some-gpl-pkg", version: "1.0.0", license: "GPL-3.0" }]);
    expect(r.passed).toBe(false);
    expect(r.failures[0]!.code).toBe("strong_copyleft");
  });

  it("fails on AGPL", () => {
    const r = runLicenseGate([
      { name: "agpl-pkg", version: "1.0.0", license: "AGPL-3.0-or-later" },
    ]);
    expect(r.passed).toBe(false);
  });

  it("fails on LGPL", () => {
    const r = runLicenseGate([{ name: "lgpl-pkg", version: "1.0.0", license: "LGPL-3.0" }]);
    expect(r.passed).toBe(false);
  });

  it("fails on BUSL when commercialRestrictedOk=false (default)", () => {
    const r = runLicenseGate([{ name: "busl-pkg", version: "1.0.0", license: "BUSL-1.1" }]);
    expect(r.passed).toBe(false);
    expect(r.failures[0]!.code).toBe("commercial_restricted");
  });

  it("accepts BUSL when commercialRestrictedOk=true (opt-in per recipe)", () => {
    const r = runLicenseGate([{ name: "busl-pkg", version: "1.0.0", license: "BUSL-1.1" }], true);
    expect(r.passed).toBe(true);
  });

  it("fails on missing license", () => {
    const r = runLicenseGate([{ name: "mystery-pkg", version: "0.1.0", license: null }]);
    expect(r.passed).toBe(false);
    expect(r.failures[0]!.code).toBe("unknown_license");
  });

  it("fails on unrecognized license string", () => {
    const r = runLicenseGate([
      { name: "weird-pkg", version: "0.1.0", license: "DoWhatYouWant-1.0" },
    ]);
    expect(r.passed).toBe(false);
  });

  it("collects multiple failures", () => {
    const r = runLicenseGate([
      { name: "ok", version: "1.0.0", license: "MIT" },
      { name: "bad1", version: "1.0.0", license: "GPL-3.0" },
      { name: "bad2", version: "1.0.0", license: "AGPL-3.0" },
      { name: "bad3", version: "1.0.0", license: null },
    ]);
    expect(r.passed).toBe(false);
    expect(r.failures).toHaveLength(3);
  });

  it("accepts Apache-2.0, ISC, BSD, MPL, CC0, Unlicense, 0BSD", () => {
    const r = runLicenseGate([
      { name: "a", version: "1.0.0", license: "Apache-2.0" },
      { name: "b", version: "1.0.0", license: "ISC" },
      { name: "c", version: "1.0.0", license: "BSD-2-Clause" },
      { name: "d", version: "1.0.0", license: "BSD-3-Clause" },
      { name: "e", version: "1.0.0", license: "MPL-2.0" },
      { name: "f", version: "1.0.0", license: "CC0-1.0" },
      { name: "g", version: "1.0.0", license: "Unlicense" },
      { name: "h", version: "1.0.0", license: "0BSD" },
    ]);
    expect(r.passed).toBe(true);
  });
});
