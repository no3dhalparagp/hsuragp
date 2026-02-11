import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
  iconBgClass?: string;
  valueColorClass?: string;
  borderColorClass?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  iconBgClass = "bg-gray-100 dark:bg-gray-800",
  valueColorClass = "",
  borderColorClass = "",
}: StatsCardProps) {
  const cardClasses = `transition-all hover:shadow-md ${borderColorClass}`;
  
  return (
    <Card className={cardClasses}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`${iconBgClass} p-2 rounded-full`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueColorClass}`}>
          {value}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
