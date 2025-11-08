/**
 * Leads Types
 */

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  status: string;
  source: string | null;
  assignedAgentId: string | null;
  projectInterestId: string | null;
  budget: string | null;
  notes: string | null;
  metadata: {
    referralCode?: string;
    channelPartnerId?: string;
    submittedFrom?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadRequest {
  name: string;
  email?: string;
  phone: string;
  referralCode?: string;
  projectInterest?: string;
  budget?: number;
  notes?: string;
}

export interface LeadsResponse {
  success: boolean;
  data: {
    leads: Lead[];
    total: number;
  };
}

export interface CreateLeadResponse {
  success: boolean;
  data: {
    lead: Lead;
    message: string;
  };
}
