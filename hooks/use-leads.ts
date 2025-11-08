/**
 * Leads Hooks
 * React Query hooks for leads management
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { leadsService } from "@/lib/api/leads";
import type { CreateLeadRequest } from "@/types/leads";

// Query keys for caching
export const leadsKeys = {
  all: ["leads"] as const,
  lists: () => [...leadsKeys.all, "list"] as const,
  detail: (id: string) => [...leadsKeys.all, "detail", id] as const,
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
      const message = error?.message || "Failed to submit lead. Please try again.";

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
