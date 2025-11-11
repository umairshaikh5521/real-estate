"use client";

/**
 * Leads Management Page
 * Comprehensive lead management for channel partners
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
import { useLeads, useUpdateLead } from "@/hooks/use-leads";
import { useSession } from "@/hooks/use-auth";
import { UserRole } from "@/types/auth";
import { AddLeadDialog, EditLeadDialog, FollowUpsDialog } from "@/components/leads/dialogs";
import { ActivityTimeline } from "@/components/leads/shared/activity-timeline";
import { columns } from "./columns";
import type { Lead } from "@/types/leads";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function LeadsPage() {
  const [view, setView] = useState<"table" | "grid">("table");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = useState(false);

  const { data: leadsData, isLoading } = useLeads();
  const { data: sessionData } = useSession();
  const updateLead = useUpdateLead();

  const user = sessionData?.data?.user;
  const isChannelPartner = user?.role === UserRole.CHANNEL_PARTNER;
  const leads = leadsData?.data?.leads || [];

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const thisMonthLeads = leads.filter(
      (lead) => new Date(lead.createdAt) >= startOfMonth
    ).length;

    const convertedLeads = leads.filter(
      (lead) => lead.status === "converted"
    ).length;

    const conversionRate =
      leads.length > 0
        ? ((convertedLeads / leads.length) * 100).toFixed(1)
        : "0";

    // Hot leads: new or contacted leads with budget > 3000000
    const hotLeads = leads.filter((lead) => {
      const hasHighBudget = lead.budget && parseFloat(lead.budget) >= 3000000;
      const isActive = ["new", "contacted", "qualified"].includes(lead.status);
      return hasHighBudget && isActive;
    }).length;

    return {
      total: leads.length,
      thisMonth: thisMonthLeads,
      conversionRate,
      hotLeads,
    };
  }, [leads]);

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [leads, statusFilter, searchQuery]);

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "New", value: "new" },
    { label: "Contacted", value: "contacted" },
    { label: "Qualified", value: "qualified" },
    { label: "Site Visit", value: "site_visit" },
    { label: "Negotiation", value: "negotiation" },
    { label: "Converted", value: "converted" },
    { label: "Lost", value: "lost" },
  ];

  const statsData = [
    {
      title: "Total Leads",
      value: stats.total.toString(),
      icon: Users,
      trend: {
        value: stats.thisMonth > 0 ? "Active" : "0",
        color: "green" as const,
      },
      comparison: "All time",
    },
    {
      title: "This Month",
      value: stats.thisMonth.toString(),
      icon: Calendar,
      trend: {
        value: "New",
        color: "green" as const,
      },
      comparison: "Current month",
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
      trend: {
        value: "Growth",
        color: "green" as const,
      },
      comparison: "Success rate",
    },
    {
      title: "Hot Leads",
      value: stats.hotLeads.toString(),
      icon: Flame,
      trend: {
        value: "Priority",
        color: "red" as const,
      },
      comparison: "High value",
    },
  ];

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

  const handleUpdateLead = async (
    leadId: string,
    data: Record<string, unknown>
  ) => {
    await updateLead.mutateAsync({ leadId, data });
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-7">
        <div>
          <h1 className="pageTitle">Leads Management</h1>
          <p className="text-muted-foreground">
            {isChannelPartner
              ? "Manage leads from your referral code and direct contacts"
              : "Complete overview of all leads in the system"}
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
          <AddLeadDialog>
            <Button variant="accent" size="lg">
              <Plus className="size-4" />
              Add New Lead
            </Button>
          </AddLeadDialog>
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
          data={filteredLeads}
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
                { label: "New", value: "new" },
                { label: "Contacted", value: "contacted" },
                { label: "Qualified", value: "qualified" },
                { label: "Site Visit", value: "site_visit" },
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
        <div className="space-y-4">
          {/* Filters for Card View */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="w-[250px]">
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
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
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredLeads.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No leads found. Start by adding a lead or sharing your
                  referral code!
                </p>
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={handleEditLead}
                  onScheduleFollowUp={handleScheduleFollowUp}
                  onViewDetails={handleViewDetails}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Edit Lead Dialog */}
      <EditLeadDialog
        lead={selectedLead}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={handleUpdateLead}
      />

      {/* Follow-ups Dialog */}
      {selectedLead && (
        <FollowUpsDialog
          leadId={selectedLead.id}
          leadName={selectedLead.name}
          open={followUpDialogOpen}
          onOpenChange={setFollowUpDialogOpen}
        />
      )}

      {/* View Details Dialog with Activity Timeline */}
      <Dialog
        open={viewDetailsDialogOpen}
        onOpenChange={setViewDetailsDialogOpen}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              {selectedLead && (
                <div className="space-y-2 mt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedLead.name}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedLead.phone}
                    </div>
                    {selectedLead.email && (
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {selectedLead.email}
                      </div>
                    )}
                    {selectedLead.budget && (
                      <div>
                        <span className="font-medium">Budget:</span> ₹
                        {parseFloat(selectedLead.budget).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="mt-6">
              <ActivityTimeline leadId={selectedLead.id} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Lead Card Component
interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onScheduleFollowUp: (lead: Lead) => void;
  onViewDetails: (lead: Lead) => void;
}

const LeadCard = ({
  lead,
  onEdit,
  onScheduleFollowUp,
  onViewDetails,
}: LeadCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "badge-blue";
      case "contacted":
        return "badge-indigo";
      case "qualified":
        return "badge-purple";
      case "site_visit":
        return "badge-yellow";
      case "negotiation":
        return "badge-orange";
      case "converted":
        return "badge-green";
      case "lost":
        return "badge-red";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatBudget = (budget: string | null) => {
    if (!budget) return null;
    const amount = parseFloat(budget);
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const timeSince = (date: string) => {
    const now = new Date();
    const createdDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow p-0">
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base mb-1.5 truncate">
              {lead.name}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1 shrink-0" />
              {timeSince(lead.createdAt)}
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

        {/* Notes Preview */}
        {/* {lead.notes && (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground line-clamp-2">
              {lead.notes}
            </p>
          </div>
        )} */}

        {/* Referral Code */}
        {/* {lead.metadata?.referralCode && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground text-xs">Referral:</span>
            <code className="bg-muted px-2 py-1 rounded text-xs font-mono font-medium">
              {lead.metadata.referralCode}
            </code>
          </div>
        )} */}

        {/* Actions */}
        <div className="pt-3 border-t">
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
                onClick={() =>
                  window.open(
                    `https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`
                  )
                }
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
      </div>
    </Card>
  );
};
