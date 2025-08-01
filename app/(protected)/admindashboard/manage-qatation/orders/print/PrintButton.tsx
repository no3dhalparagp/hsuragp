"use client";

import { Button } from "@/components/ui/button";
import { PrinterIcon as Print } from "lucide-react";

export function PrintButton() {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => window.print()}
    >
      <Print className="w-4 h-4" />
      Print
    </Button>
  );
}
