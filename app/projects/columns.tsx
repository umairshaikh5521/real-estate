"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table";
import { Project } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "badge-green";
    case "Under Construction":
      return "badge-orange";
    case "Upcoming":
      return "badge-blue";
    default:
      return "badge-gray";
  }
};

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3 min-w-[280px]">
        <Image
          src={row.original.image}
          alt={row.original.name}
          width={100}
          height={100}
          className="rounded-sm object-cover"
        />
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.location}
          </div>
        </div>
      </div>
    ),
  },
  // {
  //   accessorKey: "totalUnits",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Total" />
  //   ),
  //   cell: ({ row }) => (
  //     <div className="text-left">
  //       <div className="font-medium">{row.original.totalUnits}</div>
  //       <div className="text-sm text-muted-foreground">Total Units</div>
  //     </div>
  //   ),
  // },
  {
    accessorKey: "unitStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unit Status" />
    ),
    cell: ({ row }) => (
      <div className=" text-black font-medium">
        <div className="">{row.original.unitStatus}</div>
        <div className=" ">
          <span>Sold: </span>
          <span className="text-green-500">{row.original.soldUnits}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.original.type}</div>,
  },
  {
    accessorKey: "priceRange",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price Range" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.priceRange}</div>
    ),
  },
  {
    accessorKey: "completion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Completion" />
    ),
    cell: ({ row }) => (
      <div className="w-20">
        <div className="flex items-center gap-2  font-medium">
          {row.original.completion}%
        </div>
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
          "border text-xs font-medium",
          getStatusBadgeColor(row.original.status)
        )}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const project = row.original;

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
              onClick={() => navigator.clipboard.writeText(project.id)}
            >
              Copy project ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit project
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
