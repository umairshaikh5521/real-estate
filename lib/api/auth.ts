/**
 * Auth API Service
 * All authentication-related API calls
 */

import { apiClient } from "./client";
import type {
  SignupRequest,
  LoginRequest,
  AuthResponse,
  SessionResponse,
} from "@/types/auth";

const AUTH_BASE = "/api/auth";

/**
 * Auth service with all authentication endpoints
 */
export const authService = {
  /**
   * Create a new user account
   */
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>(`${AUTH_BASE}/signup`, data);
  },

  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>(`${AUTH_BASE}/login`, data);
  },

  /**
   * Logout and clear session
   */
  logout: async (): Promise<{ success: boolean }> => {
    return apiClient.post(`${AUTH_BASE}/logout`);
  },

  /**
   * Get current user session
   */
  getSession: async (): Promise<SessionResponse> => {
    return apiClient.get<SessionResponse>(`${AUTH_BASE}/session`);
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>(`${AUTH_BASE}/refresh`);
  },
};
