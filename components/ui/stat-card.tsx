import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { tr } from "date-fns/locale";

type StatusType =
  | "negotiation"
  | "new"
  | "contacted"
  | "site-visit"
  | "booked"
  | "lost";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    color?: "green" | "yellow" | "red";
  };
  status?: StatusType;
  comparison?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  comparison,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("p-0 shadow-none", className)}>
      <CardContent className="py-4 pb-3 px-0">
        <div className="flex items-center gap-2 mb-4 px-4">
          <div className="p-2 bg-[#F1F4FF] rounded-full">
            <Icon className="size-5 text-accent" />
          </div>
          <h3 className="text-muted-foreground">{title}</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 border-b px-4 pb-4">
            <span className="text-2xl font-semibold tracking-tight text-foreground">
              {value}
            </span>
            {trend && (
              <Badge
                className={`rounded-[25px] ${"badge-" + trend.color}`}
                variant="outline"
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}
              </Badge>
            )}
          </div>

          {comparison && (
            <p className="text-sm text-muted-foreground px-4">{comparison}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
