"use client";

/**
 * Channel Partner Leads View
 * Main view for channel partners to manage their leads
 */

import { useState, useMemo } from "react";
import {
  Plus,
  Users,
  TrendingUp,
  Calendar,
  Flame,
  Grid3X3,
  List,
  Phone,
  Mail,
  MessageSquare,
  Edit,
  MapPin,
  IndianRupee,
  Clock,
} from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLeads } from "@/hooks/use-leads";
import { AddLeadDialog, EditLeadDialog, FollowUpsDialog } from "@/components/leads/dialogs";
import { ActivityTimeline } from "@/components/leads/shared/activity-timeline";
import { columns } from "@/app/(dashboard)/leads/columns";
import type { Lead } from "@/types/leads";
import { cn } from "@/lib/utils";
import {
  formatBudget,
  getRelativeTime,
  getStatusLabel,
  getStatusColor,
  calculateChannelPartnerStats,
} from "@/components/leads/utils";

export function ChannelPartnerView() {
  const [view, setView] = useState<"table" | "grid">("table");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = useState(false);

  const { data: leadsData, isLoading } = useLeads();
  const leads = leadsData?.data?.leads || [];

  // Calculate stats
  const stats = useMemo(() => calculateChannelPartnerStats(leads), [leads]);

  const statsData = [
    {
      title: "My Leads",
      value: stats.total.toString(),
      icon: Users,
      trend: { value: `${stats.conversionRate}%`, isPositive: true },
      comparison: "conversion rate",
    },
    {
      title: "Converted",
      value: stats.converted.toString(),
      icon: TrendingUp,
      trend: { value: `${stats.conversionRate}%`, isPositive: true },
      comparison: "success rate",
    },
    {
      title: "This Month",
      value: stats.thisMonth.toString(),
      icon: Calendar,
      trend: { value: "+12%", isPositive: true },
      comparison: "vs last month",
    },
    {
      title: "Hot Leads",
      value: stats.hot.toString(),
      icon: Flame,
      trend: { value: "₹5Cr+", isPositive: true },
      comparison: "high value",
    },
  ];

  // Filter and search leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [leads, statusFilter, searchQuery]);

  // Paginate for grid view
  const paginatedLeads = filteredLeads.slice(0, 50);

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setEditDialogOpen(true);
  };

  const handleScheduleFollowUp = (lead: Lead) => {
    setSelectedLead(lead);
    setFollowUpDialogOpen(true);
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setViewDetailsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Leads</h1>
          <p className="text-muted-foreground">
            Manage and track your leads
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border bg-background">
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
          
          <AddLeadDialog>
            <Button variant="accent" size="lg">
              <Plus className="size-4" />
              Add New Lead
            </Button>
          </AddLeadDialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search leads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="negotiation">Negotiation</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content - Table or Grid */}
      {view === "table" ? (
        <DataTable
          columns={columns}
          data={filteredLeads}
          searchableColumns={[{ id: "name", title: "Name" }]}
          filterableColumns={[
            {
              id: "status",
              title: "Status",
              options: [
                { label: "New", value: "new" },
                { label: "Contacted", value: "contacted" },
                { label: "Qualified", value: "qualified" },
                { label: "Negotiation", value: "negotiation" },
                { label: "Converted", value: "converted" },
                { label: "Lost", value: "lost" },
              ],
            },
          ]}
          meta={{
            onEdit: handleEditLead,
            onScheduleFollowUp: handleScheduleFollowUp,
            onViewDetails: handleViewDetails,
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onEdit={handleEditLead}
              onScheduleFollowUp={handleScheduleFollowUp}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <EditLeadDialog
        lead={selectedLead}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      {selectedLead && (
        <FollowUpsDialog
          leadId={selectedLead.id}
          leadName={selectedLead.name}
          open={followUpDialogOpen}
          onOpenChange={setFollowUpDialogOpen}
        />
      )}

      <Dialog open={viewDetailsDialogOpen} onOpenChange={setViewDetailsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedLead?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {selectedLead && <ActivityTimeline leadId={selectedLead.id} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Lead Card Component for Grid View
interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onScheduleFollowUp: (lead: Lead) => void;
  onViewDetails: (lead: Lead) => void;
}

function LeadCard({ lead, onEdit, onScheduleFollowUp, onViewDetails }: LeadCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base mb-1.5 truncate">{lead.name}</h3>
            <p className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1 shrink-0" />
              {getRelativeTime(lead.createdAt)}
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn("shrink-0 font-medium", getStatusColor(lead.status))}
          >
            {getStatusLabel(lead.status)}
          </Badge>
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* Contact Info */}
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate">{lead.phone}</span>
          </div>
          {lead.email && (
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
          {lead.budget && (
            <div className="flex items-center gap-2.5">
              <IndianRupee className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="font-semibold">{formatBudget(lead.budget)}</span>
            </div>
          )}
          {lead.source && (
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="capitalize">{lead.source}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {lead.notes && (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {lead.notes}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-3 border-t px-4 py-3 bg-muted/20">
        <div className="flex items-center justify-between gap-2">
          {/* Primary Actions - Icon Only */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={() => window.open(`tel:${lead.phone}`)}
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={() => window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={() => onScheduleFollowUp(lead)}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Secondary Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() => onViewDetails(lead)}
            >
              <Clock className="h-4 w-4 mr-1.5" />
              <span className="text-xs font-medium">Details</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={() => onEdit(lead)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
