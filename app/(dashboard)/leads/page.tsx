"use client";

/**
 * Leads Page
 * Shows leads assigned to the current channel partner
 */

import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLeads } from "@/hooks/use-leads";
import { ReferralCodeCard } from "@/components/referral-code-card";
import { useSession } from "@/hooks/use-auth";
import { UserRole } from "@/types/auth";

export default function LeadsPage() {
  const { data: leadsData, isLoading, error } = useLeads();
  const { data: sessionData } = useSession();
  
  const user = sessionData?.data?.user;
  const isChannelPartner = user?.role === UserRole.CHANNEL_PARTNER;
  const leads = leadsData?.data?.leads || [];

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>Failed to load leads</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Leads</h1>
        <p className="text-muted-foreground mt-1">
          {isChannelPartner 
            ? "Leads assigned to you through your referral code" 
            : "All leads in the system"}
        </p>
      </div>

      {/* Referral Code Card for Channel Partners */}
      {isChannelPartner && <ReferralCodeCard />}

      {/* Leads Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Leads</CardDescription>
            <CardTitle className="text-3xl">{leads.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>New</CardDescription>
            <CardTitle className="text-3xl">
              {leads.filter((l) => l.status === "new").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Contacted</CardDescription>
            <CardTitle className="text-3xl">
              {leads.filter((l) => l.status === "contacted").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Qualified</CardDescription>
            <CardTitle className="text-3xl">
              {leads.filter((l) => l.status === "qualified").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Leads List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>
            {leads.length === 0
              ? "No leads yet. Share your referral code to get leads!"
              : `You have ${leads.length} lead${leads.length !== 1 ? "s" : ""}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No leads found. Start sharing your referral code!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-start justify-between border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{lead.name}</h3>
                      <Badge variant={lead.status === "new" ? "default" : "secondary"}>
                        {lead.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {lead.email && <p>📧 {lead.email}</p>}
                      <p>📱 {lead.phone}</p>
                      {lead.budget && <p>💰 Budget: ₹{parseFloat(lead.budget).toLocaleString()}</p>}
                      {lead.source && (
                        <p>
                          📍 Source:{" "}
                          <span className="capitalize">{lead.source}</span>
                        </p>
                      )}
                      {lead.metadata?.referralCode && (
                        <p>
                          🎫 Code:{" "}
                          <span className="font-mono font-semibold">
                            {lead.metadata.referralCode}
                          </span>
                        </p>
                      )}
                      {lead.notes && (
                        <p className="mt-2 text-sm">
                          <strong>Notes:</strong> {lead.notes}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Submitted on {new Date(lead.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
