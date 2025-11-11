/**
 * Leads Hooks
 * React Query hooks for leads management
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { leadsService } from "@/lib/api/leads";
import type { CreateLeadRequest, UpdateLeadRequest } from "@/types/leads";
import type { CreateFollowUpRequest, UpdateFollowUpRequest } from "@/types/follow-ups";

// Query keys for caching
export const leadsKeys = {
  all: ["leads"] as const,
  lists: () => [...leadsKeys.all, "list"] as const,
  detail: (id: string) => [...leadsKeys.all, "detail", id] as const,
  followUps: (id: string) => [...leadsKeys.all, id, "follow-ups"] as const,
  activities: (id: string) => [...leadsKeys.all, id, "activities"] as const,
};

/**
 * Hook to get all leads for current user
 */
export function useLeads() {
  return useQuery({
    queryKey: leadsKeys.lists(),
    queryFn: leadsService.getAll,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to create a new lead (public)
 */
export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeadRequest) => leadsService.createPublic(data),
    onSuccess: (response) => {
      toast.success("Lead submitted successfully!", {
        description: response.data.message,
      });

      // Invalidate leads cache
      queryClient.invalidateQueries({ queryKey: leadsKeys.lists() });
    },
    onError: (error: any) => {
      const message =
        error?.message || "Failed to submit lead. Please try again.";

      toast.error("Submission failed", {
        description: message,
      });
    },
  });
}

/**
 * Hook to get a single lead
 */
export function useLead(id: string) {
  return useQuery({
    queryKey: leadsKeys.detail(id),
    queryFn: () => leadsService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to update a lead
 */
export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, data }: { leadId: string; data: UpdateLeadRequest }) =>
      leadsService.update(leadId, data),
    onSuccess: (response, variables) => {
      toast.success("Lead updated successfully!");

      // Invalidate and refetch all related queries
      queryClient.invalidateQueries({ queryKey: leadsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: leadsKeys.detail(variables.leadId) });
      
      // CRITICAL: Invalidate activities to show the update in timeline
      queryClient.invalidateQueries({ queryKey: leadsKeys.activities(variables.leadId) });
      
      // Also invalidate follow-ups in case lead update affects them
      queryClient.invalidateQueries({ queryKey: leadsKeys.followUps(variables.leadId) });
    },
    onError: (error: Error) => {
      toast.error("Failed to update lead", {
        description: error.message,
      });
    },
  });
}

/**
 * Hook to create follow-up for a lead
 */
export function useCreateFollowUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, data }: { leadId: string; data: CreateFollowUpRequest }) =>
      leadsService.createFollowUp(leadId, data),
    onSuccess: (response, variables) => {
      toast.success("Follow-up scheduled successfully!");

      // Invalidate follow-ups and activities
      queryClient.invalidateQueries({ queryKey: leadsKeys.followUps(variables.leadId) });
      queryClient.invalidateQueries({ queryKey: leadsKeys.activities(variables.leadId) });
    },
    onError: (error: Error) => {
      toast.error("Failed to schedule follow-up", {
        description: error.message,
      });
    },
  });
}

/**
 * Hook to get follow-ups for a lead
 */
export function useFollowUps(leadId: string) {
  return useQuery({
    queryKey: leadsKeys.followUps(leadId),
    queryFn: () => leadsService.getFollowUps(leadId),
    enabled: !!leadId,
  });
}

/**
 * Hook to update follow-up
 */
export function useUpdateFollowUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      followUpId, 
      leadId,
      data 
    }: { 
      followUpId: string; 
      leadId: string;
      data: UpdateFollowUpRequest 
    }) => leadsService.updateFollowUp(followUpId, data),
    onSuccess: (response, variables) => {
      toast.success("Follow-up updated!");

      // Invalidate follow-ups and activities
      queryClient.invalidateQueries({ queryKey: leadsKeys.followUps(variables.leadId) });
      queryClient.invalidateQueries({ queryKey: leadsKeys.activities(variables.leadId) });
    },
    onError: (error: Error) => {
      toast.error("Failed to update follow-up", {
        description: error.message,
      });
    },
  });
}

/**
 * Hook to get activities for a lead
 */
export function useActivities(leadId: string) {
  return useQuery({
    queryKey: leadsKeys.activities(leadId),
    queryFn: () => leadsService.getActivities(leadId),
    enabled: !!leadId,
  });
}
