/**
 * Leads API Service
 */

import { apiClient } from "./client";
import type {
  CreateLeadRequest,
  CreateLeadResponse,
  LeadsResponse,
  Lead,
} from "@/types/leads";

const LEADS_BASE = "/api/leads";

export const leadsService = {
  /**
   * Create a new lead (public endpoint - from website)
   */
  createPublic: async (data: CreateLeadRequest): Promise<CreateLeadResponse> => {
    return apiClient.post<CreateLeadResponse>(`${LEADS_BASE}/public`, data);
  },

  /**
   * Get all leads (protected - for logged in users)
   */
  getAll: async (): Promise<LeadsResponse> => {
    return apiClient.get<LeadsResponse>(LEADS_BASE);
  },

  /**
   * Get lead by ID
   */
  getById: async (id: string): Promise<{ success: boolean; data: { lead: Lead } }> => {
    return apiClient.get(`${LEADS_BASE}/${id}`);
  },
};
