"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Building,
  Construction,
  CheckCircle,
  Home,
  Grid3X3,
  List,
  MapPin,
  Calendar,
  Pencil,
} from "lucide-react";
import { columns } from "./columns";
import { mockProjectsData } from "./data";
import { Project } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { AddProjectDialog } from "./components/add-project-dialog";

export default function Page() {
  const [view, setView] = useState<"table" | "grid">("table");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [projectsData, setProjectsData] = useState<Project[]>(mockProjectsData);

  const handleAddProject = (
    newProject: Omit<Project, "id" | "soldUnits" | "unitStatus">
  ) => {
    const project: Project = {
      ...newProject,
      id: `project-${Date.now()}`,
      soldUnits: 0,
      unitStatus: `${newProject.availableUnits} Available, 0 Sold`,
    };
    setProjectsData((prev) => [...prev, project]);
  };

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return projectsData.filter((project) => {
      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;
      const matchesType = typeFilter === "all" || project.type === typeFilter;
      const matchesSearch =
        searchQuery === "" ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesType && matchesSearch;
    });
  }, [projectsData, statusFilter, typeFilter, searchQuery]);

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Upcoming", value: "Upcoming" },
    { label: "Under Construction", value: "Under Construction" },
    { label: "Completed", value: "Completed" },
  ];

  const typeOptions = [
    { label: "All Types", value: "all" },
    { label: "Apartments", value: "Apartments" },
    { label: "Condos", value: "Condos" },
    { label: "Plots", value: "Plots" },
    { label: "Bungalows", value: "Bungalows" },
    { label: "Townhouse", value: "Townhouse" },
  ];

  const statsData = [
    {
      title: "Total Projects",
      value: "112",
      icon: Home,
      trend: {
        value: "20.0%",
        color: "green" as const,
      },
      comparison: "vs 23 last period",
    },
    {
      title: "Upcoming",
      value: "12",
      icon: Building,
      trend: {
        value: "20.0%",
        color: "green" as const,
      },
      comparison: "vs 5 last period",
    },
    {
      title: "Under Construction",
      value: "85",
      icon: Construction,
      trend: {
        value: "12.5%",
        color: "green" as const,
      },
      comparison: "vs 23 last period",
    },
    {
      title: "Completed",
      value: "15",
      icon: CheckCircle,
      trend: {
        value: "15.0%",
        color: "green" as const,
      },
      comparison: "vs 3 last period",
    },
  ];

  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-7">
        <div>
          <h1 className="pageTitle">Projects</h1>
          <p className="text-muted-foreground">
            {`Comprehensive overview of all projects`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border rounded-lg p-1">
            <Button
              variant={view === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("table")}
              className={`h-8 px-3 ${
                view === "table" ? "bg-accent !text-white !border-0" : ""
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("grid")}
              className={`h-8 px-3 ${
                view === "grid" ? "bg-accent !text-white !border-0" : ""
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
          <AddProjectDialog onProjectAdd={handleAddProject}>
            <Button variant="accent" size={"lg"} className="ml-auto">
              <Plus className="size-4" />
              Add New Project
            </Button>
          </AddProjectDialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-1 flex-col gap-8 mb-7">
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
      </div>

      {/* Data Table / Grid View */}
      {view === "table" ? (
        <DataTable
          columns={columns}
          data={projectsData}
          searchableColumns={[
            {
              id: "name",
              title: "Project Name",
            },
          ]}
          filterableColumns={[
            {
              id: "status",
              title: "Status",
              options: [
                { label: "Upcoming", value: "Upcoming" },
                { label: "Under Construction", value: "Under Construction" },
                { label: "Completed", value: "Completed" },
              ],
            },
            {
              id: "type",
              title: "Type",
              options: [
                { label: "Apartments", value: "Apartments" },
                { label: "Condos", value: "Condos" },
                { label: "Plots", value: "Plots" },
                { label: "Bungalows", value: "Bungalows" },
                { label: "Townhouse", value: "Townhouse" },
              ],
            },
          ]}
        />
      ) : (
        <div className="space-y-4">
          {/* Filters for Card View */}
          <div className="flex flex-col sm:flex-row gap-2 ">
            <div className="w-[250px]">
              <Input
                placeholder="Search project name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Card Grid */}
          <div className="space-y-4">
            {/* <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredData.length} of {mockProjectsData.length}{" "}
                projects
              </p>
            </div> */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredData.map((project: Project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Project Card Component
const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="border rounded-lg p-4 md:p-5 overflow-hidden bg-white hover:shadow-[0_2px_10px_rgba(229,229,229,0.7)] transition-shadow duration-300">
      <div className="relative">
        <Image
          src={project.image}
          alt={project.name}
          width={300}
          height={280}
          className="w-full h-58 object-cover rounded-md"
        />
        <div className="absolute top-4 right-4"></div>
      </div>

      <div className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <p className="text-sm text-muted-foreground mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {project.location}
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "",
              project.status === "Completed" && "badge-green",
              project.status === "Under Construction" && "badge-orange",
              project.status === "Upcoming" && "badge-blue"
            )}
          >
            {project.status}
          </Badge>
        </div>

        <div className="bg-input rounded-md p-2 mb-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-center flex flex-col items-center flex-1">
              <div className="text-lg font-bold text-gray-900">
                {project.totalUnits}
              </div>
              <div className="text-sm text-muted-foreground">Total Units</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center flex flex-col items-center flex-1">
              <div className="text-lg font-bold text-green-600">
                {project.availableUnits}
              </div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center flex flex-col items-center flex-1">
              <div className="text-lg font-bold text-blue-600">
                {project.soldUnits}
              </div>
              <div className="text-sm text-muted-foreground">Sold</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Price Range</span>
            <h3 className="font-semibold text-lg">{project.priceRange}</h3>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-between items-start pt-2.5">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 opacity-70" />
            <p className="text-sm text-muted-foreground mb-0 flex items-center">
              Completion
            </p>
          </div>
          <div>{project.expectedCompletion}</div>
        </div>
      </div>
    </div>
  );
};
