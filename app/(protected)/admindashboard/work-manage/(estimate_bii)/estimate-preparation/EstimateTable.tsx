import ItemsTable from "@/components/ItemsTable";
import { EstimateItem } from "./types";

export interface EstimateTableProps {
  items: EstimateItem[];
  estimateExists: boolean;
  isEditing: boolean;
  onDeleteItem: (index: number) => void;
  onEditItem: (index: number) => void;
  onMoveItem: (index: number, direction: "up" | "down") => void;
  onOpenRateAnalysis?: (index: number) => void;
}

export default function EstimateTable({
  items,
  estimateExists,
  isEditing,
  onDeleteItem,
  onEditItem,
  onMoveItem,
  onOpenRateAnalysis,
}: EstimateTableProps) {
  return (
    <ItemsTable
      items={items}
      deleteItem={onDeleteItem}
      editItem={onEditItem}
      moveItem={onMoveItem}
      onRateAnalysisClick={onOpenRateAnalysis}
      estimateExists={estimateExists}
      isEditing={isEditing}
    />
  );
}

