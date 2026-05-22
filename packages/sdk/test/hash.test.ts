import { describe, expect, it } from "vitest";
import { sha256Hex } from "../src/hash.js";

describe("sha256Hex", () => {
  it("returns 64-char lowercase hex", () => {
    const h = sha256Hex("hello");
    expect(h).toMatch(/^[a-f0-9]{64}$/);
  });

  it("is stable", () => {
    expect(sha256Hex("nexural")).toBe(sha256Hex("nexural"));
  });

  it("differs across inputs", () => {
    expect(sha256Hex("a")).not.toBe(sha256Hex("b"));
  });

  it("handles unicode", () => {
    expect(sha256Hex("café 🚀")).toMatch(/^[a-f0-9]{64}$/);
  });

  it("matches known vector for 'hello'", () => {
    // sha256("hello") = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
    expect(sha256Hex("hello")).toBe(
      "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
    );
  });

  it("handles empty string", () => {
    // sha256("") = e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    expect(sha256Hex("")).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  });
});
