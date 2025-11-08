"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import {
  DownloadIcon,
  BarChart3Icon,
  CalendarIcon,
  UsersIcon,
  TrendingUpIcon,
  Users,
} from "lucide-react";

export default function Page() {
  const [selectedReport, setSelectedReport] = useState("business-overview");
  const [selectedTimeframe, setSelectedTimeframe] = useState("this-month");

  const statsData = [
    {
      title: "Total Leads",
      value: "112",
      icon: Users,
      trend: {
        value: "19.4%",
        isPositive: true,
      },
      comparison: "vs 23 last period",
    },
    {
      title: "New Booking",
      value: "28",
      icon: CalendarIcon,
      trend: {
        value: "21.7%",
        isPositive: true,
      },
      comparison: "vs 23 last period",
    },
    {
      title: "New Leads",
      value: "156",
      icon: UsersIcon,
      trend: {
        value: "16.4%",
        isPositive: true,
      },
      comparison: "vs 134 last period",
    },
    {
      title: "Collections",
      value: "₹3,24,00,000",
      icon: TrendingUpIcon,
      trend: {
        value: "8.7%",
        isPositive: true,
      },
      comparison: "vs ₹2,98,00,0000 last period",
    },
  ];

  return (
    <div className="">
      <div className="flex items-end justify-between mb-7">
        <div>
          <h1 className="pageTitle">Dashboard</h1>
          <p className="text-muted-foreground">
            {`Welcome back! Here's your business overview.`}
          </p>
        </div>

        <div className="flex items-center gap-4 ">
          <Select value={selectedReport} onValueChange={setSelectedReport}>
            <SelectTrigger className="w-fit">
              <BarChart3Icon className="size-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business-overview">
                Business Overview
              </SelectItem>
              <SelectItem value="sales-performance">
                Sales Performance
              </SelectItem>
              <SelectItem value="inventory-report">Inventory Report</SelectItem>
              <SelectItem value="agent-performance">
                Agent Performance
              </SelectItem>
              <SelectItem value="collections-report">
                Collections Report
              </SelectItem>
              <SelectItem value="lead-analysis">Lead Analysis</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedTimeframe}
            onValueChange={setSelectedTimeframe}
          >
            <SelectTrigger className="w-fit">
              <SelectValue />
              {/* <ChevronDownIcon className="size-4" /> */}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="custom-range">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="accent" size={"lg"} className="ml-auto">
            <DownloadIcon className="size-4" />
            Export Data
          </Button>
        </div>
      </div>
      {/* ---Stats Cards ---- */}
      <div className="flex flex-1 flex-col gap-4 ">
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
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
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </div>
    </div>
  );
}
