"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
} from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table";
import { Lead } from "@/types/leads";
import { cn } from "@/lib/utils";

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "new":
      return "badge-blue";
    case "contacted":
      return "badge-indigo";
    case "qualified":
      return "badge-purple";
    case "site_visit":
      return "badge-yellow";
    case "negotiation":
      return "badge-orange";
    case "converted":
      return "badge-green";
    case "lost":
      return "badge-red";
    default:
      return "";
  }
};

export const columns: ColumnDef<Lead>[] = [
  {
    id: "serial",
    header: () => <div className="text-center">#</div>,
    cell: ({ row }) => (
      <div className="text-center text-muted-foreground font-medium">
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lead Name" />
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("name")}</div>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("phone")}</div>
        {row.original.email && (
          <div className="text-sm text-muted-foreground">
            {row.original.email}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "source",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source" />
    ),
    cell: ({ row }) => {
      const source = row.getValue("source") as string;
      if (!source) return <span className="text-muted-foreground">-</span>;
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium capitalize">{source}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "budget",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Budget" />
    ),
    cell: ({ row }) => {
      const budget = row.getValue("budget") as string | null;
      if (!budget) return <span className="text-muted-foreground">-</span>;
      
      const amount = parseFloat(budget);
      let formatted = "";
      if (amount >= 10000000) {
        formatted = `₹${(amount / 10000000).toFixed(1)}Cr`;
      } else if (amount >= 100000) {
        formatted = `₹${(amount / 100000).toFixed(1)}L`;
      } else {
        formatted = `₹${amount.toLocaleString()}`;
      }
      
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const getLabel = (s: string) => {
        return s.split("_").map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(" ");
      };
      
      return (
        <Badge
          variant="outline"
          className={cn(
            "font-medium",
            getStatusBadgeColor(status)
          )}
        >
          {getLabel(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      let timeAgo = "";
      if (diffDays === 0) timeAgo = "Today";
      else if (diffDays === 1) timeAgo = "Yesterday";
      else if (diffDays < 7) timeAgo = `${diffDays} days ago`;
      else if (diffDays < 30) timeAgo = `${Math.floor(diffDays / 7)} weeks ago`;
      else timeAgo = `${Math.floor(diffDays / 30)} months ago`;
      
      return (
        <div>
          <div className="font-medium">{timeAgo}</div>
          <div className="text-xs text-muted-foreground">
            {date.toLocaleDateString()}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const lead = row.original;
      const meta = table.options.meta as { 
        onEdit?: (lead: Lead) => void;
        onScheduleFollowUp?: (lead: Lead) => void;
        onViewDetails?: (lead: Lead) => void;
      } | undefined;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {meta?.onEdit && (
              <DropdownMenuItem onClick={() => meta.onEdit?.(lead)}>
                Edit lead
              </DropdownMenuItem>
            )}
            {meta?.onScheduleFollowUp && (
              <DropdownMenuItem onClick={() => meta.onScheduleFollowUp?.(lead)}>
                Follow-ups
              </DropdownMenuItem>
            )}
            {meta?.onViewDetails && (
              <DropdownMenuItem onClick={() => meta.onViewDetails?.(lead)}>
                View details
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(lead.phone)}
            >
              Copy phone number
            </DropdownMenuItem>
            {lead.email && (
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(lead.email!)}
              >
                Copy email
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
