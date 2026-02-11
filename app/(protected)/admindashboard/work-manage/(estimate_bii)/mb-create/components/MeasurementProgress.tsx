import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

interface MeasurementProgressProps {
  mbEntriesLength: number;
  measurableItemsLength: number;
  completionPercentage: number;
  selectedWorkId: string;
}

export const MeasurementProgress: React.FC<MeasurementProgressProps> = ({
  mbEntriesLength,
  measurableItemsLength,
  completionPercentage,
  selectedWorkId,
}) => {
  if (!selectedWorkId) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="bg-white border border-wb-border shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-wb-primary/10 rounded-lg">
                  <Clock className="h-5 w-5 text-wb-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Measurement Progress
                  </h3>
                  <p className="text-sm text-gray-500">
                    {mbEntriesLength} of {measurableItemsLength} items measured
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-wb-primary">
                  {completionPercentage}%
                </span>
              </div>
            </div>
            <Progress value={completionPercentage} className="h-3 bg-wb-border [&>div]:bg-wb-primary" />
            <div className="flex justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-wb-primary"></div>
                Measured: {mbEntriesLength}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                Remaining: {measurableItemsLength - mbEntriesLength}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
