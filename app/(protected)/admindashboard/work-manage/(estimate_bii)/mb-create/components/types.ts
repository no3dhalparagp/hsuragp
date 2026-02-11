export interface Measurement {
  id: string;
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
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  nos?: number;
  length?: number;
  breadth?: number;
  depth?: number;
}

export interface EstimateItem {
  id: string;
  slNo: number;
  schedulePageNo: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  nos?: number;
  length?: number;
  breadth?: number;
  depth?: number;
  measurements?: Measurement[];
  subItems?: SubItem[];
}

export interface MeasurableItem extends EstimateItem {
  isSubItem?: boolean;
  parentId?: string;
  displaySlNo?: string;
  isHeader?: boolean;
  subItemIndex?: number;
  availableSubItems?: any[]; // For grouped items
}

export interface MBEntry {
  id?: string;
  estimateItemId: string;
  subItemId?: string;
  mbNumber: string;
  mbPageNumber: string;
  workItemDescription: string;
  unit: string;
  quantityExecuted: number;
  rate: number;
  amount: number;
  measuredDate: string;
  measuredBy: string;
  checkedBy?: string;
  remarks?: string;
  measurements?: Measurement[];
  createdAt?: string;
}

export interface MBFormData {
  mbNumber: string;
  mbPageNumber: string;
  measuredDate: string;
  measuredBy: string;
  checkedBy: string;
}
