
export interface Measurement {
  id?: string;
  description: string;
  nos: number;
  length: number;
  breadth: number;
  depth: number;
  quantity: number;
}

export interface SubItem {
  id: string;
  description: string;
  nos?: number;
  length?: number;
  breadth?: number;
  depth?: number;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

/** Drain estimate: item can take L/B/D from master params (like Excel). */
export type DrainParamKey =
  | "lengthOfDrain"
  | "clearWidthOfDrain"
  | "depthUS"
  | "depthDS"
  | "ccThicknessFoundation"
  | "sandFillingFoundation"
  | "widthBrickWork"
  | "widthEarthCutting"
  | "avgDepthEarthCutting"
  | "avgDepthBrickWork";

export interface EstimateItem {
  id: string;
  slNo: number;
  schedulePageNo: string;
  description: string;
  measurements: Measurement[];
  subItems?: SubItem[];
  nos: number;
  length: number;
  breadth: number;
  depth: number;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  /** Link to drain param for length (cum/sqm items). When set, length is taken from drain params. */
  lengthParamKey?: DrainParamKey;
  breadthParamKey?: DrainParamKey;
  depthParamKey?: DrainParamKey;
}

export interface ProjectInfo {
  projectName: string;
  projectCode: number | string;
  location: string;
  preparedBy: string;
  date: string;
}

export interface ApprovedActionPlanDetails {
  activityDescription: string;
  activityCode: string | number;
  locationofAsset: string;
  schemeName: string;
}

export interface Work {
  id: string;
  workslno: string;
  ApprovedActionPlanDetails: ApprovedActionPlanDetails;
  [key: string]: any; // Allow other properties for now
}

export interface EstimateData {
  items: EstimateItem[];
  projectInfo: ProjectInfo;
  contingency: number;
}

/** Road or Drain estimate type — different dimension UIs and behaviour */
export type EstimateType = "road" | "drain";

/** Road/Drain: set length, breadth, depth once and apply to all items */
export interface GlobalDimensions {
  length: string;
  breadth: string;
  depth: string;
}

/** Drain estimate: master dimensions (like Excel top section). Change once, all linked items update. */
export interface DrainParams {
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

export const DRAIN_PARAM_LABELS: Record<DrainParamKey, string> = {
  lengthOfDrain: "Length of Drain (M)",
  clearWidthOfDrain: "Clear Width of Drain (M)",
  depthUS: "Depth at U/S (M)",
  depthDS: "Depth at D/S (M)",
  ccThicknessFoundation: "CC (1:1.5:3) thickness at foundation (M)",
  sandFillingFoundation: "Sand filling at foundation (M)",
  widthBrickWork: "Width of Brick work 6:1 (M)",
  widthEarthCutting: "Width of Earth Cutting (M)",
  avgDepthEarthCutting: "Average Depth of Earth Cutting (M)",
  avgDepthBrickWork: "Average Depth of Brick Work (M)",
};

export const DRAIN_PARAM_KEYS: DrainParamKey[] = [
  "lengthOfDrain",
  "clearWidthOfDrain",
  "depthUS",
  "depthDS",
  "ccThicknessFoundation",
  "sandFillingFoundation",
  "widthBrickWork",
  "widthEarthCutting",
  "avgDepthEarthCutting",
  "avgDepthBrickWork",
];

/** Params that are auto-calculated (read-only in UI). */
export const DRAIN_CALCULATED_KEYS: DrainParamKey[] = [
  "depthDS",
  "widthEarthCutting",
  "avgDepthEarthCutting",
  "avgDepthBrickWork",
];

export const DEFAULT_DRAIN_PARAMS: DrainParams = {
  lengthOfDrain: "",
  clearWidthOfDrain: "0.300",
  depthUS: "0.400",
  depthDS: "", // calculated: depthUS + lengthOfDrain/300
  ccThicknessFoundation: "0.075",
  sandFillingFoundation: "0.050",
  widthBrickWork: "0.250",
  widthEarthCutting: "", // calculated from clear width + 2*brick + 2*cc + 2*sand
  avgDepthEarthCutting: "", // calculated: (depthUS + depthDS)/2
  avgDepthBrickWork: "", // calculated: (depthUS + depthDS)/2
};
