export type WarishDetailType = {
  id: string;
  name: string;
  gender: string;
  relation: string;
  livingStatus: string;
  maritialStatus: string;
  hasbandName: string | null;
  parentId: string | null;
  warishApplicationId: string;
  children: WarishDetailType[];
}; 
