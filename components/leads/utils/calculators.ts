/**
 * Lead Calculation Utilities
 * Pure functions for stats and metrics calculation
 */

import type { Lead } from "@/types/leads";

/**
 * Calculate conversion rate
 */
export function calculateConversionRate(leads: Lead[]): number {
  if (leads.length === 0) return 0;
  const converted = leads.filter((l) => l.status === "converted").length;
  return Math.round((converted / leads.length) * 100);
}

/**
 * Check if date is in current month
 */
export function isThisMonth(date: string | Date): boolean {
  const now = new Date();
  const targetDate = typeof date === "string" ? new Date(date) : date;
  return (
    targetDate.getMonth() === now.getMonth() &&
    targetDate.getFullYear() === now.getFullYear()
  );
}

/**
 * Calculate total value from leads
 */
export function calculateTotalValue(leads: Lead[]): number {
  return leads.reduce((sum, lead) => {
    const budget = typeof lead.budget === "string" ? parseFloat(lead.budget) : lead.budget;
    return sum + (budget || 0);
  }, 0);
}

/**
 * Get hot leads (high budget)
 */
export function getHotLeads(leads: Lead[], threshold: number = 5000000): Lead[] {
  return leads.filter((lead) => {
    const budget = typeof lead.budget === "string" ? parseFloat(lead.budget) : lead.budget;
    return budget && budget >= threshold;
  });
}

/**
 * Group leads by status
 */
export function groupLeadsByStatus(leads: Lead[]): Record<string, Lead[]> {
  return leads.reduce((acc, lead) => {
    if (!acc[lead.status]) {
      acc[lead.status] = [];
    }
    acc[lead.status].push(lead);
    return acc;
  }, {} as Record<string, Lead[]>);
}

/**
 * Calculate channel partner stats
 */
export function calculateChannelPartnerStats(leads: Lead[]) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    total: leads.length,
    converted: leads.filter((l) => l.status === "converted").length,
    pending: leads.filter((l) => l.status === "new" || l.status === "contacted").length,
    thisMonth: leads.filter((l) => new Date(l.createdAt) >= startOfMonth).length,
    hot: getHotLeads(leads).length,
    conversionRate: calculateConversionRate(leads),
  };
}

/**
 * Calculate builder stats
 */
export function calculateBuilderStats(leads: Lead[]) {
  const stats = calculateChannelPartnerStats(leads);
  
  return {
    ...stats,
    unassigned: 0, // TODO: Implement when assignedChannelPartnerId is added to Lead type
    activePartners: 0, // TODO: Implement when assignedChannelPartnerId is added to Lead type
    totalValue: calculateTotalValue(leads),
  };
}
