import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Gender,
  MaritialStatus,
  LivingStatus,
  WarishApplicationStatus,
} from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCheck, UserX, Users } from "lucide-react";
import { WarishDetailProps, WarishApplicationProps } from "@/types";
import { capitalizeFirstLetter, formatText } from "@/utils/formatText";
import { cn } from "@/lib/utils";

const getSerialNumber = (depth: number, index: number): string => {
  if (depth === 0) return `${index + 1}`;
  if (depth === 1) return String.fromCharCode(65 + index);
  return String.fromCharCode(97 + index);
};

const renderWarishDetails = (
  details: WarishDetailProps[],
  depth = 0,
  parentIndex = ""
): React.ReactNode[] => {
  return details.flatMap((detail, index) => {
    const currentIndex = parentIndex
      ? `${parentIndex}.${getSerialNumber(depth, index)}`
      : getSerialNumber(depth, index);

    return [
      <TableRow
        key={detail.id}
        className={cn(
          "transition-colors duration-200",
          depth % 2 === 0 ? "bg-muted/30" : "bg-background",
          depth > 0 && "text-sm"
        )}
      >
        <TableCell className="font-mono text-right w-[10%] text-muted-foreground">
          {currentIndex}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {detail.livingStatus === "alive" ? (
              <UserCheck className="h-4 w-4 text-green-500" />
            ) : (
              <UserX className="h-4 w-4 text-red-500" />
            )}
            <span className="font-medium">{formatText(detail.name)}</span>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant={detail.gender === "male" ? "default" : "secondary"}>
            {capitalizeFirstLetter(detail.gender)}
          </Badge>
        </TableCell>
        <TableCell className="text-muted-foreground">
          {formatText(detail.relation)}
        </TableCell>
        <TableCell>
          <Badge
            variant={
              detail.livingStatus === "alive" ? "success" : "destructive"
            }
          >
            {capitalizeFirstLetter(detail.livingStatus)}
          </Badge>
        </TableCell>
        <TableCell className="text-muted-foreground">
          {detail.hasbandName ? formatText(detail.hasbandName) : "—"}
        </TableCell>
      </TableRow>,
      ...(detail.children.length > 0
        ? renderWarishDetails(detail.children, depth + 1, currentIndex)
        : []),
    ];
  });
};

export default function LegalHeirrApplicationDetails({
  application,
  rootWarishDetails,
}: {
  application: WarishApplicationProps;
  rootWarishDetails: WarishDetailProps[];
}) {
  return (
    <Card className="w-full border-t-4 border-t-primary shadow-md mb-2">
      <CardHeader className="bg-muted/50 border-b">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-background rounded-md shadow-sm">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <span>Table of Legal Heirs</span>
          <Badge variant="outline" className="ml-auto">
            Total: {rootWarishDetails.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 mb-2">
        <ScrollArea className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="text-center">Sl No.</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Relation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Spouse Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderWarishDetails(rootWarishDetails)}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
