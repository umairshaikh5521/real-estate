"use client";

import * as React from "react";
import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2 h-[50px]", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="dataTable"
            size="sm"
            className="-ml-3 h-8 !bg-transparent data-[state=open]:bg-transparent data-[state=open]:!text-black"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            className="group"
            onClick={() => column.toggleSorting(false)}
          >
            <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-white" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem
            className="group"
            onClick={() => column.toggleSorting(true)}
          >
            <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-white" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="group"
            onClick={() => column.toggleVisibility(false)}
          >
            <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-white" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
