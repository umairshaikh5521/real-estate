/**
 * Settings Hooks
 * React Query hooks for user settings management
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { settingsService } from "@/lib/api/settings";
import type { UpdateProfileRequest, ChangePasswordRequest } from "@/lib/api/settings";
import { authKeys } from "./use-auth";

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => settingsService.updateProfile(data),
    onSuccess: (response: any) => {
      toast.success("Profile updated successfully!");

      // Update session cache with new user data
      queryClient.setQueryData(authKeys.session, (old: any) => ({
        ...old,
        data: {
          ...old?.data,
          user: response.data.user,
        },
      }));

      // Invalidate session to refetch fresh data
      queryClient.invalidateQueries({ queryKey: authKeys.session });
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to update profile";
      toast.error("Update failed", {
        description: message,
      });
    },
  });
}

/**
 * Hook to change password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => settingsService.changePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully!", {
        description: "Your password has been updated",
      });
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to change password";
      toast.error("Password change failed", {
        description: message,
      });
    },
  });
}
