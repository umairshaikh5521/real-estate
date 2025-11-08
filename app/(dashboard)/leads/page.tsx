"use client";

import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import {
  DownloadIcon,
  Plus,
  Handshake,
  Users,
  UserPlus,
  Flame,
} from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { mockLeadsData } from "./data";

export default function Page() {
  const statsData = [
    {
      title: "Total Leads",
      value: "112",
      icon: Users,
      trend: {
        value: "20.0%",
        color: "green" as const,
      },
      comparison: "vs 23 last period",
    },
    {
      title: "New Leads",
      value: "12",
      icon: UserPlus,
      trend: {
        value: "20.0%",
        color: "green" as const,
      },
      comparison: "vs 5 last period",
    },
    {
      title: "Hot Leads",
      value: "15",
      icon: Flame,
      trend: {
        value: "20.0%",
        color: "green" as const,
      },
      comparison: "vs 23 last period",
    },
    {
      title: "Converted",
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
          <h1 className="pageTitle">Leads Management</h1>
          <p className="text-muted-foreground">
            {`Track and manage your sales leads`}
          </p>
        </div>

        <div className="flex items-center gap-4 ">
          <Button variant="default" size={"lg"} className="ml-auto">
            <DownloadIcon className="size-4" />
            Export Data
          </Button>
          <Button variant="accent" size={"lg"} className="ml-auto">
            <Plus className="size-4" />
            Add Lead
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
          data={mockLeadsData}
          searchableColumns={[
            {
              id: "name",
              title: "Lead Name",
            },
          ]}
          filterableColumns={[
            {
              id: "status",
              title: "Status",
              options: [
                { label: "New", value: "New" },
                { label: "Contacted", value: "Contacted" },
                { label: "Site Visit", value: "Site Visit" },
                { label: "Negotiation", value: "Negotiation" },
                { label: "Booked", value: "Booked" },
                { label: "Lost", value: "Lost" },
              ],
            },
            {
              id: "leadSource",
              title: "Lead Source",
              options: [
                { label: "Facebook", value: "Facebook" },
                { label: "Expo", value: "Expo" },
                { label: "Walkin", value: "Walkin" },
                { label: "Referral", value: "Referral" },
                { label: "Website", value: "Website" },
                { label: "Campaign", value: "Campaign" },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}
