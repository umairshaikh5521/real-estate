"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  Facebook,
  Users,
  Globe,
  Megaphone,
  Calendar,
  Footprints,
} from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table";
import { Lead } from "@/types";
import { cn } from "@/lib/utils";

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "New":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "Contacted":
      return "badge-indigo";
    case "Site Visit":
      return "badge-purple";
    case "Negotiation":
      return "badge-yellow";
    case "Booked":
      return "badge-green";
    case "Lost":
      return "badge-red";
    default:
      return "";
  }
};

const getScoreColor = (score: number) => {
  if (score >= 9) return "badge-red";
  if (score >= 7) return "badge-orange";
  if (score >= 5) return "badge-yellow";
  if (score >= 0) return "badge-green";
  return "badge-gray";
};

const getSourceIcon = (source: string) => {
  switch (source) {
    case "Facebook":
      return Facebook;
    case "Expo":
      return Calendar;
    case "Referral":
      return Users;
    case "Website":
      return Globe;
    case "Walkin":
      return Footprints;
    case "Campaign":
      return Megaphone;
    default:
      return Users;
  }
};

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lead Identity" />
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("name")}</div>
        <div className="text-sm text-muted-foreground">
          ID: {row.original.id}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "leadSource",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lead Source" />
    ),
    cell: ({ row }) => {
      const source = row.getValue("leadSource") as string;
      const IconComponent = getSourceIcon(source);
      return (
        <div className="flex items-center gap-2">
          <IconComponent className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{source}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("phone")}</div>
        <div className="text-sm text-muted-foreground">
          {row.original.email}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "projectInterested",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Interested" />
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("projectInterested")}</div>
        {row.original.unitDetails && (
          <div className="text-sm text-muted-foreground">
            • {row.original.unitDetails}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          "font-medium",
          getStatusBadgeColor(row.getValue("status"))
        )}
      >
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    accessorKey: "leadScore",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lead Score" />
    ),
    cell: ({ row }) => {
      const score = row.getValue("leadScore") as number;
      return (
        <div className="flex items-center justify-center">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              getScoreColor(score)
            )}
          >
            {score}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const lead = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(lead.id)}
            >
              Copy lead ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View lead details</DropdownMenuItem>
            <DropdownMenuItem>Edit lead</DropdownMenuItem>
            <DropdownMenuItem>Schedule follow-up</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Delete lead
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
