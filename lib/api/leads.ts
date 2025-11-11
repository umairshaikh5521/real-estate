/**
 * Leads API Service
 */

import { apiClient } from "./client";
import type {
  CreateLeadRequest,
  UpdateLeadRequest,
  CreateLeadResponse,
  UpdateLeadResponse,
  LeadsResponse,
  Lead,
} from "@/types/leads";
import type {
  CreateFollowUpRequest,
  UpdateFollowUpRequest,
  FollowUpsResponse,
  CreateFollowUpResponse,
  FollowUp,
} from "@/types/follow-ups";
import type { ActivitiesResponse } from "@/types/activities";

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

  /**
   * Update a lead
   */
  update: async (
    leadId: string,
    data: UpdateLeadRequest
  ): Promise<UpdateLeadResponse> => {
    return apiClient.put<UpdateLeadResponse>(`${LEADS_BASE}/${leadId}`, data);
  },

  /**
   * Create follow-up for a lead
   */
  createFollowUp: async (
    leadId: string,
    data: CreateFollowUpRequest
  ): Promise<CreateFollowUpResponse> => {
    return apiClient.post<CreateFollowUpResponse>(
      `${LEADS_BASE}/${leadId}/follow-ups`,
      data
    );
  },

  /**
   * Get follow-ups for a lead
   */
  getFollowUps: async (leadId: string): Promise<FollowUpsResponse> => {
    return apiClient.get<FollowUpsResponse>(
      `${LEADS_BASE}/${leadId}/follow-ups`
    );
  },

  /**
   * Update follow-up (mark as complete)
   */
  updateFollowUp: async (
    followUpId: string,
    data: UpdateFollowUpRequest
  ): Promise<{ success: boolean; data: { followUp: FollowUp; message: string } }> => {
    return apiClient.put(`${LEADS_BASE}/follow-ups/${followUpId}`, data);
  },

  /**
   * Get activities for a lead
   */
  getActivities: async (leadId: string): Promise<ActivitiesResponse> => {
    return apiClient.get<ActivitiesResponse>(
      `${LEADS_BASE}/${leadId}/activities`
    );
  },
};
