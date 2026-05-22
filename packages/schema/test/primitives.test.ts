/**
 * Primitive atoms — exhaustive validation tests + property-based round-trip.
 * Per ADR-0010 §2.5 (property-based testing via fast-check).
 */

import { describe, expect, it } from "vitest";
import fc from "fast-check";
import {
  DecayDays,
  Email,
  EnvVarName,
  Federation,
  GitSha,
  IsoDate,
  Iso8601,
  KebabSlug,
  OpUri,
  PositiveUsdAmount,
  RepoUrl,
  SchemaVersion,
  SemverString,
  Sha256Hex,
  TrustTier,
  Ulid,
  UsdAmount,
  WarehouseStatus,
} from "../src/primitives.js";

describe("Iso8601", () => {
  it("accepts ISO 8601 with offset", () => {
    expect(Iso8601.parse("2026-05-22T03:49:21+00:00")).toBe("2026-05-22T03:49:21+00:00");
    expect(Iso8601.parse("2026-05-22T03:49:21Z")).toBe("2026-05-22T03:49:21Z");
  });

  it("rejects date-only", () => expect(() => Iso8601.parse("2026-05-22")).toThrow());
  it("rejects missing timezone", () =>
    expect(() => Iso8601.parse("2026-05-22T03:49:21")).toThrow());
  it("rejects non-ISO string", () => expect(() => Iso8601.parse("May 22 2026")).toThrow());
  it("rejects empty string", () => expect(() => Iso8601.parse("")).toThrow());
  it("rejects non-string input", () =>
    expect(() => Iso8601.parse(1234567890 as unknown as string)).toThrow());
});

describe("IsoDate", () => {
  it("accepts YYYY-MM-DD", () => expect(IsoDate.parse("2026-05-22")).toBe("2026-05-22"));
  it("rejects with timezone", () => expect(() => IsoDate.parse("2026-05-22T00:00:00Z")).toThrow());
  it("rejects MM/DD/YYYY", () => expect(() => IsoDate.parse("05/22/2026")).toThrow());
  it("rejects single-digit components", () => expect(() => IsoDate.parse("2026-5-22")).toThrow());
  it("rejects YY format", () => expect(() => IsoDate.parse("26-05-22")).toThrow());
  it("rejects empty string", () => expect(() => IsoDate.parse("")).toThrow());
});

describe("Ulid", () => {
  it("accepts a valid 26-char Crockford base32 ULID", () => {
    expect(Ulid.parse("01H8XK7Q3F9V7M5N0E3B4P2J6T")).toBe("01H8XK7Q3F9V7M5N0E3B4P2J6T");
  });
  it("rejects lowercase", () => expect(() => Ulid.parse("01h8xk7q3f9v7m5n0e3b4p2j6t")).toThrow());
  it("rejects too short", () => expect(() => Ulid.parse("01H8XK7Q3F")).toThrow());
  it("rejects too long", () => expect(() => Ulid.parse("01H8XK7Q3F9V7M5N0E3B4P2J6T999")).toThrow());
  it("rejects forbidden chars (I, L, O, U)", () =>
    expect(() => Ulid.parse("ILOU8XK7Q3F9V7M5N0E3B4P2J6T")).toThrow());
  it("rejects empty", () => expect(() => Ulid.parse("")).toThrow());
});

describe("KebabSlug", () => {
  it("accepts simple", () => expect(KebabSlug.parse("auth")).toBe("auth"));
  it("accepts multi-word", () =>
    expect(KebabSlug.parse("saas-multitenant-baseline")).toBe("saas-multitenant-baseline"));
  it("rejects uppercase", () => expect(() => KebabSlug.parse("Auth")).toThrow());
  it("rejects underscores", () => expect(() => KebabSlug.parse("multi_tenant")).toThrow());
  it("rejects leading hyphen", () => expect(() => KebabSlug.parse("-auth")).toThrow());
  it("rejects trailing hyphen", () => expect(() => KebabSlug.parse("auth-")).toThrow());
  it("rejects double-hyphen", () => expect(() => KebabSlug.parse("multi--tenant")).toThrow());
  it("rejects spaces", () => expect(() => KebabSlug.parse("multi tenant")).toThrow());
  it("rejects empty", () => expect(() => KebabSlug.parse("")).toThrow());

  // Property-based per ADR-0010 §2.5
  it("round-trips for any valid kebab-case (property-based)", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.stringMatching(/^[a-z0-9]+$/).filter((s) => s.length > 0 && s.length < 20),
          { minLength: 1, maxLength: 5 },
        ),
        (parts) => {
          const slug = parts.join("-");
          expect(KebabSlug.parse(slug)).toBe(slug);
        },
      ),
    );
  });
});

describe("TrustTier", () => {
  it.each(["public", "internal", "private-encrypted"] as const)("accepts %s", (t) =>
    expect(TrustTier.parse(t)).toBe(t),
  );
  it("rejects unknown tier", () => expect(() => TrustTier.parse("secret")).toThrow());
  it("rejects empty", () => expect(() => TrustTier.parse("")).toThrow());
  it("rejects uppercase", () => expect(() => TrustTier.parse("PUBLIC")).toThrow());
  it("rejects number", () => expect(() => TrustTier.parse(1 as unknown as string)).toThrow());
  it("rejects null", () => expect(() => TrustTier.parse(null as unknown as string)).toThrow());
});

describe("WarehouseStatus", () => {
  it.each(["active", "seeded", "archived", "deprecated", "merged"] as const)("accepts %s", (s) =>
    expect(WarehouseStatus.parse(s)).toBe(s),
  );
  it("rejects unknown", () => expect(() => WarehouseStatus.parse("retired")).toThrow());
  it("rejects empty", () => expect(() => WarehouseStatus.parse("")).toThrow());
  it("rejects uppercase", () => expect(() => WarehouseStatus.parse("ACTIVE")).toThrow());
  it("rejects number", () => expect(() => WarehouseStatus.parse(1 as unknown as string)).toThrow());
  it("rejects null", () =>
    expect(() => WarehouseStatus.parse(null as unknown as string)).toThrow());
});

describe("SchemaVersion", () => {
  it("accepts 1", () => expect(SchemaVersion.parse(1)).toBe(1));
  it("rejects 0", () => expect(() => SchemaVersion.parse(0)).toThrow());
  it("rejects 2", () => expect(() => SchemaVersion.parse(2)).toThrow());
  it("rejects string", () => expect(() => SchemaVersion.parse("1" as unknown as number)).toThrow());
  it("rejects float", () => expect(() => SchemaVersion.parse(1.5)).toThrow());
  it("rejects null", () => expect(() => SchemaVersion.parse(null as unknown as number)).toThrow());
});

describe("SemverString", () => {
  it.each([
    "1.0.0",
    "0.0.1",
    "10.20.30",
    "1.0.0-alpha.1",
    "1.0.0-beta.2",
    "1.0.0-rc.1",
    "1.0.0+20130313144700",
  ])("accepts %s", (s) => expect(SemverString.parse(s)).toBe(s));
  it("rejects v-prefix", () => expect(() => SemverString.parse("v1.0.0")).toThrow());
  it("rejects two-part", () => expect(() => SemverString.parse("1.0")).toThrow());
  it("rejects leading zero", () => expect(() => SemverString.parse("01.0.0")).toThrow());
  it("rejects empty", () => expect(() => SemverString.parse("")).toThrow());
  it("rejects garbage", () => expect(() => SemverString.parse("not.a.version")).toThrow());
});

describe("RepoUrl", () => {
  it("accepts github.com URL", () =>
    expect(RepoUrl.parse("https://github.com/JasonTeixeira/nexural-meta")).toBe(
      "https://github.com/JasonTeixeira/nexural-meta",
    ));
  it("rejects http (not https)", () =>
    expect(() => RepoUrl.parse("http://github.com/x/y")).toThrow());
  it("rejects gitlab", () => expect(() => RepoUrl.parse("https://gitlab.com/x/y")).toThrow());
  it("rejects bare hostname", () => expect(() => RepoUrl.parse("github.com/x/y")).toThrow());
  it("rejects empty", () => expect(() => RepoUrl.parse("")).toThrow());
  it("rejects non-URL", () => expect(() => RepoUrl.parse("not a url")).toThrow());
});

describe("Email", () => {
  it("accepts simple", () => expect(Email.parse("sage@example.com")).toBe("sage@example.com"));
  it("rejects no @", () => expect(() => Email.parse("invalid")).toThrow());
  it("rejects no domain", () => expect(() => Email.parse("a@")).toThrow());
  it("rejects no local part", () => expect(() => Email.parse("@b.com")).toThrow());
  it("rejects empty", () => expect(() => Email.parse("")).toThrow());
  it("rejects space", () => expect(() => Email.parse("a @ b.com")).toThrow());
});

describe("DecayDays", () => {
  it.each([1, 7, 90, 365, 3650])("accepts %s", (n) => expect(DecayDays.parse(n)).toBe(n));
  it("rejects 0", () => expect(() => DecayDays.parse(0)).toThrow());
  it("rejects negative", () => expect(() => DecayDays.parse(-1)).toThrow());
  it("rejects too many days", () => expect(() => DecayDays.parse(3651)).toThrow());
  it("rejects float", () => expect(() => DecayDays.parse(1.5)).toThrow());
  it("rejects null", () => expect(() => DecayDays.parse(null as unknown as number)).toThrow());
});

describe("Federation", () => {
  it("accepts factory", () => expect(Federation.parse("factory")).toBe("factory"));
  it("accepts lifeops", () => expect(Federation.parse("lifeops")).toBe("lifeops"));
  it("rejects unknown", () => expect(() => Federation.parse("apps")).toThrow());
  it("rejects empty", () => expect(() => Federation.parse("")).toThrow());
  it("rejects uppercase", () => expect(() => Federation.parse("Factory")).toThrow());
  it("rejects null", () => expect(() => Federation.parse(null as unknown as string)).toThrow());
  it("rejects number", () => expect(() => Federation.parse(1 as unknown as string)).toThrow());
});

describe("GitSha", () => {
  it("accepts 7-char sha", () => expect(GitSha.parse("a1b2c3d")).toBe("a1b2c3d"));
  it("accepts 40-char sha", () => {
    const sha = "a".repeat(40);
    expect(GitSha.parse(sha)).toBe(sha);
  });
  it("accepts 64-char sha256", () => {
    const sha = "9".repeat(64);
    expect(GitSha.parse(sha)).toBe(sha);
  });
  it("rejects 6-char", () => expect(() => GitSha.parse("a1b2c3")).toThrow());
  it("rejects uppercase", () => expect(() => GitSha.parse("A1B2C3D")).toThrow());
  it("rejects non-hex", () => expect(() => GitSha.parse("a1b2c3g")).toThrow());
});

describe("Sha256Hex", () => {
  it("accepts 64-char hex", () => {
    const h = "f".repeat(64);
    expect(Sha256Hex.parse(h)).toBe(h);
  });
  it("rejects 63-char", () => expect(() => Sha256Hex.parse("f".repeat(63))).toThrow());
  it("rejects 65-char", () => expect(() => Sha256Hex.parse("f".repeat(65))).toThrow());
  it("rejects uppercase", () => expect(() => Sha256Hex.parse("F".repeat(64))).toThrow());
  it("rejects non-hex", () => expect(() => Sha256Hex.parse("g".repeat(64))).toThrow());
  it("rejects empty", () => expect(() => Sha256Hex.parse("")).toThrow());
});

describe("OpUri", () => {
  it("accepts op:// URI", () =>
    expect(OpUri.parse("op://Nexural/Stripe/secret_key")).toBe("op://Nexural/Stripe/secret_key"));
  it("rejects without scheme", () =>
    expect(() => OpUri.parse("Nexural/Stripe/secret_key")).toThrow());
  it("rejects wrong scheme", () => expect(() => OpUri.parse("file:///etc/passwd")).toThrow());
  it("rejects http", () => expect(() => OpUri.parse("http://nexural/")).toThrow());
  it("rejects empty", () => expect(() => OpUri.parse("")).toThrow());
});

describe("EnvVarName", () => {
  it("accepts SCREAMING_SNAKE", () =>
    expect(EnvVarName.parse("STRIPE_SECRET_KEY")).toBe("STRIPE_SECRET_KEY"));
  it("accepts leading underscore", () => expect(EnvVarName.parse("_PRIVATE")).toBe("_PRIVATE"));
  it("rejects lowercase", () => expect(() => EnvVarName.parse("stripe_secret")).toThrow());
  it("rejects leading digit", () => expect(() => EnvVarName.parse("1STRIPE")).toThrow());
  it("rejects hyphen", () => expect(() => EnvVarName.parse("STRIPE-SECRET")).toThrow());
  it("rejects empty", () => expect(() => EnvVarName.parse("")).toThrow());
});

describe("UsdAmount + PositiveUsdAmount", () => {
  it("UsdAmount accepts 0", () => expect(UsdAmount.parse(0)).toBe(0));
  it("UsdAmount accepts positive", () => expect(UsdAmount.parse(10)).toBe(10));
  it("UsdAmount rejects negative", () => expect(() => UsdAmount.parse(-1)).toThrow());
  it("PositiveUsdAmount rejects 0", () => expect(() => PositiveUsdAmount.parse(0)).toThrow());
  it("PositiveUsdAmount rejects negative", () =>
    expect(() => PositiveUsdAmount.parse(-0.01)).toThrow());
  it("PositiveUsdAmount accepts small positive", () =>
    expect(PositiveUsdAmount.parse(0.01)).toBe(0.01));
});
