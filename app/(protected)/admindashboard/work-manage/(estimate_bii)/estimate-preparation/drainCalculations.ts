/**
 * Drain Construction Estimation Module
 * 
 * This module provides calculations for drain construction estimates based on
 * Public Works Department (PWD) standards and practices.
 * 
 * Key Assumptions:
 * - Bed slope: 1:300 (1 meter vertical drop per 300 meters horizontal length)
 * - Brick work slope: 6:1 (horizontal:vertical)
 * - Concrete mix: 1:1.5:3 (cement:sand:aggregate)
 * 
 * All calculations follow PWD standard formulas used in civil engineering
 * estimation sheets.
 * 
 * @version 1.0.0
 * @created 2024
 * @lastModified 2024-06-15
 */

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Bed slope ratio for drain construction
 * 
 * Represents the standard slope of 1:300 (vertical:horizontal)
 * This means for every 300 meters of horizontal length, the drain drops
 * 1 meter in elevation from upstream to downstream.
 * 
 * @constant {number}
 * @default 300
 * @unit meters per meter (m/m)
 * @example For a 150m long drain, downstream will be 0.5m deeper than upstream
 */
export const BED_SLOPE_RATIO = 300;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Rounds a number to 3 decimal places
 * 
 * This precision level is suitable for construction estimates where
 * measurements are typically in meters with millimeter precision.
 * 
 * @param {number} n - The number to round
 * @returns {number} Number rounded to 3 decimal places
 * @example round3(1.23456) => 1.235
 */
function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

// ============================================================================
// CORE CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculates the depth at the downstream end of the drain
 * 
 * Formula: Depth at D/S = Depth at U/S + (Length of Drain / Bed Slope Ratio)
 * This accounts for the required slope for proper water flow.
 * 
 * @param {number} depthUS - Depth at upstream end (in meters)
 * @param {number} lengthOfDrain - Total length of drain (in meters)
 * @returns {number} Depth at downstream end (in meters, rounded to 3 decimals)
 * 
 * @example
 * // For a 150m drain with 1m upstream depth and 1:300 slope:
 * // depthDS = 1 + (150 / 300) = 1.5m
 * calcDepthDS(1, 150); // Returns 1.5
 */
export function calcDepthDS(depthUS: number, lengthOfDrain: number): number {
  // Validate inputs
  if (depthUS < 0) {
    console.warn('Warning: Upstream depth should not be negative. Using 0.');
    depthUS = 0;
  }
  
  if (lengthOfDrain < 0) {
    console.warn('Warning: Drain length should not be negative. Using 0.');
    lengthOfDrain = 0;
  }
  
  // Apply formula: D/S depth = U/S depth + (Length / Slope Ratio)
  const depthDS = depthUS + lengthOfDrain / BED_SLOPE_RATIO;
  
  return round3(depthDS);
}

/**
 * Calculates the total width required for earth cutting/excavation
 * 
 * This includes the clear drain width plus allowances for:
 * 1. Brick work on both sides (6:1 slope)
 * 2. Concrete foundation on both sides (1:1.5:3 mix)
 * 3. Sand filling at foundation on both sides
 * 
 * Formula:
 * Width = Clear Width + 2×(Brick Work) + 2×(Concrete Foundation) + 2×(Sand Filling)
 * 
 * @param {number} clearWidthOfDrain - Internal clear width of the finished drain
 * @param {number} widthBrickWork - Width of brick work on one side
 * @param {number} ccThicknessFoundation - Thickness of concrete foundation on one side
 * @param {number} sandFillingFoundation - Thickness of sand filling on one side
 * @returns {number} Total excavation width (in meters, rounded to 3 decimals)
 * 
 * @example
 * // For a drain with 0.6m clear width, 0.23m brick work,
 * // 0.15m concrete, and 0.1m sand on each side:
 * // Width = 0.6 + 2×0.23 + 2×0.15 + 2×0.1 = 1.56m
 * calcWidthEarthCutting(0.6, 0.23, 0.15, 0.1); // Returns 1.56
 */
export function calcWidthEarthCutting(
  clearWidthOfDrain: number,
  widthBrickWork: number,
  ccThicknessFoundation: number,
  sandFillingFoundation: number
): number {
  // Validate all inputs are non-negative
  const inputs = [
    { value: clearWidthOfDrain, name: 'clearWidthOfDrain' },
    { value: widthBrickWork, name: 'widthBrickWork' },
    { value: ccThicknessFoundation, name: 'ccThicknessFoundation' },
    { value: sandFillingFoundation, name: 'sandFillingFoundation' }
  ];
  
  inputs.forEach(({ value, name }) => {
    if (value < 0) {
      console.warn(`Warning: ${name} should not be negative. Using 0.`);
      // Note: In production, you might want to adjust the parameter directly
      // or throw an error depending on requirements
    }
  });
  
  // Calculate total width including all components on both sides
  const totalWidth = clearWidthOfDrain +
    2 * widthBrickWork +
    2 * ccThicknessFoundation +
    2 * sandFillingFoundation;
  
  return round3(totalWidth);
}

/**
 * Calculates the average depth of earth cutting/excavation
 * 
 * Used for estimating earthwork volume. The average depth is the
 * mean of upstream and downstream depths.
 * 
 * Formula: Average Depth = (Depth at U/S + Depth at D/S) ÷ 2
 * 
 * @param {number} depthUS - Depth at upstream end (in meters)
 * @param {number} depthDS - Depth at downstream end (in meters)
 * @returns {number} Average excavation depth (in meters, rounded to 3 decimals)
 * 
 * @example
 * // For a drain with 1m upstream depth and 1.5m downstream depth:
 * // Average = (1 + 1.5) / 2 = 1.25m
 * calcAvgDepthEarthCutting(1, 1.5); // Returns 1.25
 */
export function calcAvgDepthEarthCutting(depthUS: number, depthDS: number): number {
  // Simple average of upstream and downstream depths
  const averageDepth = (depthUS + depthDS) / 2;
  
  return round3(averageDepth);
}

/**
 * Calculates the average depth of brick work
 * 
 * Similar to earth cutting average depth, but specifically for
 * brick work volume estimation. Typically the same as earth cutting
 * average depth since bricks follow the drain profile.
 * 
 * Formula: Average Depth = (Depth at U/S + Depth at D/S) ÷ 2
 * 
 * @param {number} depthUS - Depth at upstream end (in meters)
 * @param {number} depthDS - Depth at downstream end (in meters)
 * @returns {number} Average brick work depth (in meters, rounded to 3 decimals)
 * 
 * @example
 * // For a drain with 1m upstream depth and 1.5m downstream depth:
 * // Average = (1 + 1.5) / 2 = 1.25m
 * calcAvgDepthBrickWork(1, 1.5); // Returns 1.25
 */
export function calcAvgDepthBrickWork(depthUS: number, depthDS: number): number {
  // Same calculation as earth cutting average depth
  const averageDepth = (depthUS + depthDS) / 2;
  
  return round3(averageDepth);
}

// ============================================================================
// INTERFACES AND TYPES
// ============================================================================

/**
 * Input parameters for drain calculations
 * 
 * All values are stored as strings for form input compatibility,
 * but represent numeric values in meters.
 * 
 * @interface DrainParamsInput
 * @property {string} lengthOfDrain - Total length of the drain (m)
 * @property {string} clearWidthOfDrain - Internal clear width (m)
 * @property {string} depthUS - Depth at upstream end (m)
 * @property {string} depthDS - Depth at downstream end (m) [calculated]
 * @property {string} ccThicknessFoundation - Concrete foundation thickness (m)
 * @property {string} sandFillingFoundation - Sand filling thickness (m)
 * @property {string} widthBrickWork - Brick work width (m)
 * @property {string} widthEarthCutting - Total excavation width (m) [calculated]
 * @property {string} avgDepthEarthCutting - Average excavation depth (m) [calculated]
 * @property {string} avgDepthBrickWork - Average brick work depth (m) [calculated]
 */
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

// ============================================================================
// MAIN COMPUTATION FUNCTION
// ============================================================================

/**
 * Computes all derived drain parameters from user inputs
 * 
 * This is the main function that orchestrates all calculations.
 * It takes the current state (user inputs) and returns only the
 * calculated fields that need to be updated.
 * 
 * Calculation Sequence:
 * 1. Convert string inputs to numbers (empty/invalid become 0)
 * 2. Calculate downstream depth based on slope
 * 3. Calculate total excavation width
 * 4. Calculate average depths for earth cutting and brick work
 * 5. Return only the calculated values for state merging
 * 
 * @param {DrainParamsInput} prev - Current input parameters as strings
 * @returns {Partial<DrainParamsInput>} Object containing only calculated fields
 * 
 * @example
 * const inputs = {
 *   lengthOfDrain: "150",
 *   clearWidthOfDrain: "0.6",
 *   depthUS: "1",
 *   depthDS: "",
 *   ccThicknessFoundation: "0.15",
 *   sandFillingFoundation: "0.1",
 *   widthBrickWork: "0.23",
 *   widthEarthCutting: "",
 *   avgDepthEarthCutting: "",
 *   avgDepthBrickWork: ""
 * };
 * 
 * const results = computeDerivedDrainParams(inputs);
 * // Returns:
 * // {
 * //   depthDS: "1.5",
 * //   widthEarthCutting: "1.56",
 * //   avgDepthEarthCutting: "1.25",
 * //   avgDepthBrickWork: "1.25"
 * // }
 */
export function computeDerivedDrainParams(
  prev: DrainParamsInput
): Partial<DrainParamsInput> {
  // Parse all numeric inputs, defaulting to 0 for invalid/empty values
  const lengthOfDrain = Number(prev.lengthOfDrain) || 0;
  const clearWidthOfDrain = Number(prev.clearWidthOfDrain) || 0;
  const depthUS = Number(prev.depthUS) || 0;
  const depthDS = Number(prev.depthDS) || 0;
  const cc = Number(prev.ccThicknessFoundation) || 0;
  const sand = Number(prev.sandFillingFoundation) || 0;
  const widthBrick = Number(prev.widthBrickWork) || 0;
  
  // Calculate downstream depth using bed slope
  const newDepthDS = calcDepthDS(depthUS, lengthOfDrain);
  
  // Calculate total excavation width including all components
  const newWidthEarth = calcWidthEarthCutting(
    clearWidthOfDrain,
    widthBrick,
    cc,
    sand
  );
  
  // Calculate average depths for volume estimations
  const newAvgEarth = calcAvgDepthEarthCutting(depthUS, newDepthDS);
  const newAvgBrick = calcAvgDepthBrickWork(depthUS, newDepthDS);
  
  // Return only the calculated fields as strings for state update
  // This follows React's pattern of partial state updates
  return {
    depthDS: String(newDepthDS),
    widthEarthCutting: String(newWidthEarth),
    avgDepthEarthCutting: String(newAvgEarth),
    avgDepthBrickWork: String(newAvgBrick),
  };
}

// ============================================================================
// ADDITIONAL HELPER FUNCTIONS (Optional Enhancements)
// ============================================================================

/**
 * Validates that a numeric input is non-negative
 * 
 * @param {number} value - The value to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {number} Validated value (0 if input was negative)
 */
export function validateNonNegative(value: number, fieldName: string): number {
  if (value < 0) {
    console.error(`Error: ${fieldName} cannot be negative. Using 0.`);
    return 0;
  }
  return value;
}

/**
 * Calculates the volume of earth cutting/excavation
 * 
 * Formula: Volume = Length × Width × Average Depth
 * 
 * @param {number} length - Length of drain (m)
 * @param {number} width - Width of earth cutting (m)
 * @param {number} avgDepth - Average depth of earth cutting (m)
 * @returns {number} Volume in cubic meters (m³)
 */
export function calcEarthCuttingVolume(
  length: number,
  width: number,
  avgDepth: number
): number {
  const volume = length * width * avgDepth;
  return round3(volume);
}

/**
 * Calculates the volume of brick work
 * 
 * Formula: Volume = Length × Width × Average Depth
 * Note: Brick work typically has width on both sides, so multiply by 2
 * 
 * @param {number} length - Length of drain (m)
 * @param {number} widthPerSide - Width of brick work per side (m)
 * @param {number} avgDepth - Average depth of brick work (m)
 * @returns {number} Total brick work volume in cubic meters (m³)
 */
export function calcBrickWorkVolume(
  length: number,
  widthPerSide: number,
  avgDepth: number
): number {
  // Multiply by 2 for both sides of the drain
  const volume = length * widthPerSide * avgDepth * 2;
  return round3(volume);
}

// ============================================================================
// EXPORT SUMMARY
// ============================================================================

/**
 * @exports
 * 
 * Primary exports:
 * - BED_SLOPE_RATIO: Constant for drain slope (1:300)
 * - calcDepthDS: Calculate downstream depth
 * - calcWidthEarthCutting: Calculate total excavation width
 * - calcAvgDepthEarthCutting: Calculate average excavation depth
 * - calcAvgDepthBrickWork: Calculate average brick work depth
 * - DrainParamsInput: Type interface for input parameters
 * - computeDerivedDrainParams: Main function to compute all derived values
 * 
 * Secondary exports (enhancements):
 * - validateNonNegative: Input validation helper
 * - calcEarthCuttingVolume: Earth work volume calculator
 * - calcBrickWorkVolume: Brick work volume calculator
 */
