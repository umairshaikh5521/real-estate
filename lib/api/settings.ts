/**
 * Settings API Service
 */

import { apiClient } from "./client";

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const settingsService = {
  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileRequest) => {
    return apiClient.put("/api/auth/profile", data);
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordRequest) => {
    return apiClient.put("/api/auth/password", data);
  },
};
