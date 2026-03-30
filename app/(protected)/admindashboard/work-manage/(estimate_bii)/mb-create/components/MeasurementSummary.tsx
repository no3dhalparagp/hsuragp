import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MBEntry } from "./types";

interface MeasurementSummaryProps {
  mbEntries: MBEntry[];
  totalAmount: number;
  selectedWorkId: string;
}

export const MeasurementSummary: React.FC<MeasurementSummaryProps> = ({
  mbEntries,
  totalAmount,
  selectedWorkId,
}) => {
  return (
    <AnimatePresence>
      {selectedWorkId && mbEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-slate-200 border-l-4 border-l-green-500 bg-white shadow-sm rounded-xl">
            <CardContent className="pt-6">
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-green-50 rounded-xl">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px] text-slate-800">
                      Measurement Summary
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      Total recorded items
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Total Items
                    </p>
                    <p className="text-2xl font-black text-slate-800">
                      {mbEntries.length}
                    </p>
                  </div>
                  <div className="space-y-1 p-4 bg-green-50 border border-green-100 rounded-xl">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">
                      Total Value
                    </p>
                    <p className="text-2xl font-black text-green-600">
                      ₹{totalAmount.toFixed(3)}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Average Rate per Unit
                  </p>
                  <p className="text-xl font-bold text-slate-700">
                    ₹
                    {(mbEntries.length > 0
                      ? totalAmount /
                        mbEntries.reduce(
                          (sum, entry) => sum + entry.quantityExecuted,
                          0,
                        )
                      : 0
                    ).toFixed(3)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
