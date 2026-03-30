
// ========== COMPACTION FACTOR OPTIONS ==========
export const COMPACTION_OPTIONS = {
  normal: 1.1,
  loose: 1.15,
  river: 1.12,
  machine: 1.08,
  hand: 1.12,
} as const;

export type CompactionKey = keyof typeof COMPACTION_OPTIONS;

/**
 * Centralized quantity calculator for construction items.
 * Handles different units and compaction factors.
 * 
 * @param unit - The unit of measurement (m, sqm, cum, no, bags, LS)
 * @param nos - Number of items
 * @param L - Length (meters)
 * @param B - Breadth (meters)
 * @param D - Depth/Height (meters)
 * @param compaction - Compaction factor (multiplier)
 * @returns The calculated quantity rounded or floored appropriately
 */
export function calcQty(
  unit: string,
  nos: number | string,
  L: number | string,
  B: number | string,
  D: number | string,
  compaction: number = 1.0,
) {
  const nosVal = Number(nos) || 0;
  const lVal = Number(L) || 0;
  const bVal = Number(B) || 0;
  const dVal = Number(D) || 0;
  const u = (unit || "m").toLowerCase();

  switch (u) {
    case "m":
    case "rm":
      return nosVal * lVal;
    case "sqm":
      return nosVal * lVal * bVal;
    case "cum":
      return nosVal * lVal * bVal * dVal;
    case "no":
    case "nos":
    case "each":
      return nosVal;
    case "bags":
      // Standard calculation for cement bags from cubic volume
      return Math.ceil(nosVal * lVal * bVal * dVal * compaction * 35.34);
    case "ls":
    case "lumpsum":
      return 1;
    default:
      // Fallback: If no recognized unit, but has dimensions, multiply them 
      const hasValue = nosVal > 0 || lVal > 0 || bVal > 0 || dVal > 0;
      if (!hasValue) return 0;
      return (nosVal || 1) * (lVal || 1) * (bVal || 1) * (dVal || 1);
  }
}
