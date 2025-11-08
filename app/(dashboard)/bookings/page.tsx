"use client";

import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import {
  DownloadIcon,
  Plus,
  Check,
  IndianRupee,
  Handshake,
  CalendarCheck2,
} from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { mockBookingsData } from "./data";

export default function Page() {
  const statsData = [
    {
      title: "Total Booking",
      value: "112",
      icon: CalendarCheck2,
      trend: {
        value: "20.0%",
        color: "green" as const,
      },
      comparison: "vs 23 last period",
    },
    {
      title: "Active",
      value: "12",
      icon: Check,
      trend: {
        value: "20.0%",
        color: "green" as const,
      },
      comparison: "vs 5 last period",
    },
    {
      title: "Total Value",
      value: "1,30,00,0000",
      icon: IndianRupee,
      trend: {
        value: "20.0%",
        color: "green" as const,
      },
      comparison: "vs 23 last period",
    },
    {
      title: "Completed",
      value: "14",
      icon: Handshake,
      trend: {
        value: "20.0%",
        color: "green" as const,
      },
      comparison: "vs 3 last period",
    },
  ];

  return (
    <div className="">
      <div className="flex items-end justify-between mb-7">
        <div>
          <h1 className="pageTitle">Bookings</h1>
          <p className="text-muted-foreground">
            {`Welcome back! Here's your business overview.`}
          </p>
        </div>

        <div className="flex items-center gap-4 ">
          <Button variant="default" size={"lg"} className="ml-auto">
            <DownloadIcon className="size-4" />
            Export Data
          </Button>
          <Button variant="accent" size={"lg"} className="ml-auto">
            <Plus className="size-4" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-1 flex-col gap-8 ">
        <div className="grid auto-rows-min gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              comparison={stat.comparison}
            />
          ))}
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={mockBookingsData}
          searchableColumns={[
            {
              id: "buyerName",
              title: "Buyer Name",
            },
          ]}
          filterableColumns={[
            {
              id: "status",
              title: "Status",
              options: [
                { label: "Active", value: "Active" },
                { label: "Completed", value: "Completed" },
                { label: "Cancelled", value: "Cancelled" },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}
