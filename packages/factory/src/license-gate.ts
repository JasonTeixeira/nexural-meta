/**
 * License composition gate per ADR-0006 §4.
 *
 * Forge fails if any direct or transitive dep is:
 *   - Strong copyleft (GPL, AGPL, LGPL)
 *   - Source-available commercial-restricted (BUSL, SSPL, Elastic-2.0)
 *       UNLESS recipe explicitly opts in via `commercial_restricted_ok: true`
 *   - Unknown license
 */

export const ALLOWED_BY_DEFAULT: ReadonlySet<string> = new Set([
  "MIT",
  "Apache-2.0",
  "ISC",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "MPL-2.0",
  "CC0-1.0",
  "Unlicense",
  "0BSD",
]);

export const STRONG_COPYLEFT: ReadonlySet<string> = new Set([
  "GPL-2.0",
  "GPL-2.0-only",
  "GPL-2.0-or-later",
  "GPL-3.0",
  "GPL-3.0-only",
  "GPL-3.0-or-later",
  "AGPL-3.0",
  "AGPL-3.0-only",
  "AGPL-3.0-or-later",
  "LGPL-2.1",
  "LGPL-2.1-only",
  "LGPL-2.1-or-later",
  "LGPL-3.0",
  "LGPL-3.0-only",
  "LGPL-3.0-or-later",
]);

export const COMMERCIAL_RESTRICTED: ReadonlySet<string> = new Set([
  "BUSL-1.1",
  "SSPL-1.0",
  "Elastic-2.0",
]);

export interface SbomEntry {
  readonly name: string;
  readonly version: string;
  readonly license: string | null;
}

export type GateFailureCode = "strong_copyleft" | "commercial_restricted" | "unknown_license";

export interface GateFailure {
  readonly package: string;
  readonly version: string;
  readonly license: string | null;
  readonly code: GateFailureCode;
}

export interface GateResult {
  readonly passed: boolean;
  readonly failures: ReadonlyArray<GateFailure>;
}

/**
 * Run the license gate on a list of SBOM entries.
 *
 * @param sbom dep tree from cyclonedx-npm or equivalent
 * @param commercialRestrictedOk if true, BUSL/SSPL/Elastic are accepted (per recipe declaration)
 */
export function runLicenseGate(
  sbom: ReadonlyArray<SbomEntry>,
  commercialRestrictedOk = false,
): GateResult {
  const failures: GateFailure[] = [];
  for (const entry of sbom) {
    if (entry.license === null) {
      failures.push({
        package: entry.name,
        version: entry.version,
        license: null,
        code: "unknown_license",
      });
      continue;
    }
    if (STRONG_COPYLEFT.has(entry.license)) {
      failures.push({
        package: entry.name,
        version: entry.version,
        license: entry.license,
        code: "strong_copyleft",
      });
      continue;
    }
    if (COMMERCIAL_RESTRICTED.has(entry.license) && !commercialRestrictedOk) {
      failures.push({
        package: entry.name,
        version: entry.version,
        license: entry.license,
        code: "commercial_restricted",
      });
      continue;
    }
    // Unknown-but-not-banned licenses also fail — explicit allowlist only.
    if (!ALLOWED_BY_DEFAULT.has(entry.license) && !COMMERCIAL_RESTRICTED.has(entry.license)) {
      failures.push({
        package: entry.name,
        version: entry.version,
        license: entry.license,
        code: "unknown_license",
      });
    }
  }
  return { passed: failures.length === 0, failures };
}
