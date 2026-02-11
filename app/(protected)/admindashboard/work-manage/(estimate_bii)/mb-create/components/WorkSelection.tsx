import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import WorkSearchAndSelect from "@/components/WorkSearchAndSelect";
import { motion } from "framer-motion";

interface WorkSelectionProps {
  works: any[];
  selectedWorkId: string;
  onSelect: (id: string) => void;
}

export const WorkSelection: React.FC<WorkSelectionProps> = ({
  works,
  selectedWorkId,
  onSelect,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
    >
      <Card className="border-wb-border shadow-sm hover:shadow-md transition-shadow bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-wb-primary/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-wb-primary" />
            </div>
            <div>
              <span>Select Work</span>
              <CardDescription className="mt-1">
                Choose a work to create measurement entries
              </CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WorkSearchAndSelect
            works={works}
            selectedWorkId={selectedWorkId}
            onSelect={onSelect}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};
