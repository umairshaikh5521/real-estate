"use client";

import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { DownloadIcon, Plus, IndianRupee, Users, User } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { mockAgentsData } from "./data";

export default function Page() {
  const statsData = [
    {
      title: "Total Agents",
      value: "112",
      icon: Users,
      trend: {
        value: "20.0%",
        color: "green" as const,
      },
      comparison: "vs 23 last period",
    },
    {
      title: "Active Agents",
      value: "12",
      icon: User,
      trend: {
        value: "20.0%",
        color: "green" as const,
      },
      comparison: "vs 5 last period",
    },
    {
      title: "Total Commission",
      value: "₹2.8 Cr",
      icon: IndianRupee,
      trend: {
        value: "20.0%",
        color: "green" as const,
      },
      comparison: "vs 1.4 Cr last period",
    },
    {
      title: "Pending Payout",
      value: "₹1.3 Cr",
      icon: IndianRupee,
      trend: {
        value: "20.0%",
        color: "green" as const,
      },
      comparison: "vs 1.5 Cr last period",
    },
  ];

  return (
    <div className="">
      <div className="flex items-end justify-between mb-7">
        <div>
          <h1 className="pageTitle">Agents & Dealers</h1>
          <p className="text-muted-foreground">
            {`Manage your sales team and dealer network`}
          </p>
        </div>

        <div className="flex items-center gap-4 ">
          <Button variant="default" size={"lg"} className="ml-auto">
            <DownloadIcon className="size-4" />
            Export Data
          </Button>
          <Button variant="accent" size={"lg"} className="ml-auto">
            <Plus className="size-4" />
            Add Agent
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
          data={mockAgentsData}
          searchableColumns={[
            {
              id: "name",
              title: "Agent Name",
            },
            {
              id: "email",
              title: "Email",
            },
          ]}
          filterableColumns={[
            {
              id: "status",
              title: "Status",
              options: [
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ],
            },
            {
              id: "type",
              title: "Type",
              options: [
                { label: "External", value: "External" },
                { label: "Internal", value: "Internal" },
                { label: "Dealer", value: "Dealer" },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}
