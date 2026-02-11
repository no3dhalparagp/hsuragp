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
          <Card className="border-wb-border border-l-4 border-l-wb-success bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-wb-success/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-wb-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-wb-success">
                      Measurement Summary
                    </h3>
                    <p className="text-sm text-wb-success/80">
                      Total recorded items
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 p-3 bg-white/50 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">
                      Total Items
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mbEntries.length}
                    </p>
                  </div>
                  <div className="space-y-1 p-3 bg-wb-success/5 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">
                      Total Value
                    </p>
                    <p className="text-2xl font-bold text-wb-success">
                      ₹{totalAmount.toFixed(3)}
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-white/50 rounded-lg">
                  <p className="text-xs text-gray-600 font-medium mb-1">
                    Average Rate per Unit
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
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
