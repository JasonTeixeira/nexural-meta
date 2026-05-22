/**
 * Decay status calculation per ARCHITECTURE.md §1 + RETIREMENT.md §8.
 */

export type DecayStatus = "fresh" | "stale" | "quarantined" | "auto-deprecate";

export interface DecayCheck {
  status: DecayStatus;
  daysSinceReview: number;
  decayRateDays: number;
  multiplier: number;
}

/**
 * Compute decay status for an entry or warehouse.
 *
 * @param lastReviewed ISO date string (YYYY-MM-DD)
 * @param decayRateDays decay rate from meta.yaml / frontmatter
 * @param nowMs optional clock injection for testing
 */
export function checkDecay(
  lastReviewed: string,
  decayRateDays: number,
  nowMs?: number,
): DecayCheck {
  const reviewedMs = Date.parse(lastReviewed);
  if (Number.isNaN(reviewedMs)) {
    throw new Error(`invalid lastReviewed date: ${lastReviewed}`);
  }
  const now = nowMs ?? Date.now();
  const daysSinceReview = Math.floor((now - reviewedMs) / (1000 * 60 * 60 * 24));
  const multiplier = daysSinceReview / decayRateDays;

  let status: DecayStatus;
  if (multiplier <= 1) status = "fresh";
  else if (multiplier <= 2) status = "stale";
  else if (multiplier <= 3) status = "quarantined";
  else status = "auto-deprecate";

  return { status, daysSinceReview, decayRateDays, multiplier };
}
