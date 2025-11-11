/**
 * Leads Module Types
 */

export interface LeadStats {
  total: number;
  converted: number;
  hot: number;
  thisMonth: number;
  conversionRate: number;
}

export interface ChannelPartnerStats extends LeadStats {
  pending: number;
}

export interface BuilderStats extends LeadStats {
  unassigned: number;
  activePartners: number;
  totalValue: number;
}

export type LeadView = "table" | "grid";

export type LeadStatusFilter = 
  | "all" 
  | "new" 
  | "contacted" 
  | "qualified" 
  | "negotiation" 
  | "converted" 
  | "lost";
