/**
 * Drain estimate formulas (from Excel / PWD practice).
 * Bed slope 1:300 V:H = 1 m vertical drop per 300 m length.
 */

export const BED_SLOPE_RATIO = 300; // 1:300 V:H

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/** Depth at D/S = Depth at U/S + (Length of Drain / 300) */
export function calcDepthDS(depthUS: number, lengthOfDrain: number): number {
  return round3(depthUS + lengthOfDrain / BED_SLOPE_RATIO);
}

/**
 * Width of Earth Cutting = Clear Width of Drain
 *   + 2 * Width of Brick work(6:1)
 *   + 2 * CC (1:1.5:3) thickness at foundation
 *   + 2 * Sand filling at foundation
 * Rounded to 3 decimals.
 */
export function calcWidthEarthCutting(
  clearWidthOfDrain: number,
  widthBrickWork: number,
  ccThicknessFoundation: number,
  sandFillingFoundation: number
): number {
  const w =
    clearWidthOfDrain +
    2 * widthBrickWork +
    2 * ccThicknessFoundation +
    2 * sandFillingFoundation;
  return round3(w);
}

/** Average Depth of Earth Cutting = (Depth at U/S + Depth at D/S) / 2, rounded to 3 decimals */
export function calcAvgDepthEarthCutting(depthUS: number, depthDS: number): number {
  return round3((depthUS + depthDS) / 2);
}

/** Average Depth of Brick Work = (Depth at U/S + Depth at D/S) / 2, rounded to 3 decimals */
export function calcAvgDepthBrickWork(depthUS: number, depthDS: number): number {
  return round3((depthUS + depthDS) / 2);
}

export interface DrainParamsInput {
  lengthOfDrain: string;
  clearWidthOfDrain: string;
  depthUS: string;
  depthDS: string;
  ccThicknessFoundation: string;
  sandFillingFoundation: string;
  widthBrickWork: string;
  widthEarthCutting: string;
  avgDepthEarthCutting: string;
  avgDepthBrickWork: string;
}

/** Compute derived drain params from input fields. Returns only the calculated values to merge into state. */
export function computeDerivedDrainParams(
  prev: DrainParamsInput
): Partial<DrainParamsInput> {
  const lengthOfDrain = Number(prev.lengthOfDrain) || 0;
  const clearWidthOfDrain = Number(prev.clearWidthOfDrain) || 0;
  const depthUS = Number(prev.depthUS) || 0;
  const depthDS = Number(prev.depthDS) || 0;
  const cc = Number(prev.ccThicknessFoundation) || 0;
  const sand = Number(prev.sandFillingFoundation) || 0;
  const widthBrick = Number(prev.widthBrickWork) || 0;

  const newDepthDS = calcDepthDS(depthUS, lengthOfDrain);
  const newWidthEarth = calcWidthEarthCutting(
    clearWidthOfDrain,
    widthBrick,
    cc,
    sand
  );
  const newAvgEarth = calcAvgDepthEarthCutting(depthUS, newDepthDS);
  const newAvgBrick = calcAvgDepthBrickWork(depthUS, newDepthDS);

  return {
    depthDS: String(newDepthDS),
    widthEarthCutting: String(newWidthEarth),
    avgDepthEarthCutting: String(newAvgEarth),
    avgDepthBrickWork: String(newAvgBrick),
  };
}
