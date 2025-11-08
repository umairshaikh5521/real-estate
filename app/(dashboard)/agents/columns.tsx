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
import { MoreHorizontal } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table";
import { Agent } from "@/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "Inactive":
      return "bg-red-50 text-red-600 border-red-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case "External":
      return "bg-green-50 text-green-600 border-green-200";
    case "Internal":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "Dealer":
      return "bg-orange-50 text-orange-600 border-orange-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

export const columns: ColumnDef<Agent>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Agent Details" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={row.original.avatar} alt={row.original.name} />
          <AvatarFallback>
            {row.original.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground">
            PAN: {row.original.pan}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.phone}</div>
        <div className="text-sm text-muted-foreground">
          {row.original.email}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "leads",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Performance" />
    ),
    cell: ({ row }) => (
      <div>
        <div className="text-sm text-muted-foreground">
          {row.original.leads} Leads
        </div>
        <div className="text-sm text-muted-foreground">
          {row.original.bookings} Bookings
        </div>
        <div className="text-sm text-muted-foreground">
          {row.original.commissionRate}% Commission
        </div>
      </div>
    ),
  },
  {
    accessorKey: "totalEarned",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Commission" />
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">
          ₹{row.original.totalEarned.toLocaleString()}
        </div>
        <div className="text-sm text-muted-foreground">Total Earned</div>
      </div>
    ),
  },
  {
    accessorKey: "payoutStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payout Status" />
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.payoutStatus}</div>
        <div className="text-sm text-muted-foreground">
          ₹{row.original.paidAmount.toLocaleString()}
        </div>
        <div className="text-sm text-muted-foreground">
          Pending ₹{row.original.pendingAmount.toLocaleString()}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type & Status" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <Badge
          variant="outline"
          className={cn(
            "font-medium",
            getStatusBadgeColor(row.original.status)
          )}
        >
          {row.original.status}
        </Badge>
        <Badge
          variant="outline"
          className={cn("font-medium", getTypeBadgeColor(row.original.type))}
        >
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const agent = row.original;

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
              onClick={() => navigator.clipboard.writeText(agent.id)}
            >
              Copy agent ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View agent details</DropdownMenuItem>
            <DropdownMenuItem>Edit agent</DropdownMenuItem>
            <DropdownMenuItem>View performance</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Deactivate agent
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
