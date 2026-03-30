import { useMemo } from "react";
import { EstimateItem, TaxBreakup } from "../types";

export interface TaxSettings {
  gstPercent: number;
  lwcPercent: number;
}

const DEFAULT_SETTINGS: TaxSettings = {
  gstPercent: 18,
  lwcPercent: 1,
};

export const useEstimateCalculations = (
  items: EstimateItem[],
  contingency: number,
  settings: TaxSettings = DEFAULT_SETTINGS
) => {
  return useMemo(() => {
    const itemTotal = items.reduce((sum, item) => sum + item.amount, 0);

    const gst = (itemTotal * settings.gstPercent) / 100;
    const costExclLWC = itemTotal + gst;
    const lwc = (costExclLWC * settings.lwcPercent) / 100;
    const costInclLWC = costExclLWC + lwc;
    const finalCost = Math.round(costInclLWC + contingency);

    const taxBreakups: TaxBreakup[] = [
      {
        id: "GST",
        label: `GST @${settings.gstPercent}%`,
        type: "GST",
        percentage: settings.gstPercent,
        amount: gst,
        appliesOn: "itemTotal",
        order: 1,
      },
      {
        id: "LWC",
        label: `Labour Welfare Cess @${settings.lwcPercent}%`,
        type: "LWC",
        percentage: settings.lwcPercent,
        amount: lwc,
        appliesOn: "itemTotalPlusTax",
        order: 2,
      },
      {
        id: "CONTINGENCY",
        label: "Contingency (LS)",
        type: "Contingency",
        amount: contingency,
        appliesOn: "custom",
        order: 3,
      },
    ];

    return {
      itemTotal,
      gst,
      costExclLWC,
      lwc,
      costInclLWC,
      finalCost,
      taxBreakups,
    };
  }, [items, contingency, settings.gstPercent, settings.lwcPercent]);
};
