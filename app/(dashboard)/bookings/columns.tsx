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
import { MoreHorizontal } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table";
import { Booking } from "@/types";
import { cn } from "@/lib/utils";

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Active":
      return "badge-blue";
    case "Completed":
      return "badge-green";
    case "Cancelled":
      return "badge-red";
    default:
      return "badge-gray";
  }
};

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "id",
    header: "Lead Identity",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("id")}</div>
        <div className="text-sm text-muted-foreground">{row.original.date}</div>
      </div>
    ),
  },
  {
    accessorKey: "buyerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Buyer Information" />
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("buyerName")}</div>
        <div className="text-sm text-muted-foreground">
          {row.original.buyerEmail}
        </div>
        <div className="text-sm text-muted-foreground">
          {row.original.buyerPhone}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "project",
    header: "Project & Unit",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("project")}</div>
        <div className="text-sm text-muted-foreground">{row.original.unit}</div>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("amount")}</div>
        <div className="text-sm text-green-600">{row.original.percentage}</div>
      </div>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("paymentStatus")}</div>
        <div className="text-sm text-muted-foreground">
          {row.original.paymentAmount}
        </div>
        <div className="text-sm text-muted-foreground">
          Balance {row.original.balance}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={cn(getStatusBadgeColor(status), "rounded-[25px]")}
          variant="outline"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const booking = row.original;

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
              onClick={() => navigator.clipboard.writeText(booking.id)}
            >
              Copy booking ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View booking details</DropdownMenuItem>
            <DropdownMenuItem>Edit booking</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Cancel booking
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
