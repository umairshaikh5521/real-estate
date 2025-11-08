/**
 * Authentication Types
 * Shared types for auth-related data structures
 */

export enum UserRole {
  ADMIN = "admin",
  BUILDER = "builder",
  CHANNEL_PARTNER = "channel_partner",
  CUSTOMER = "customer",
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: UserRole;
  emailVerified: boolean;
  avatar?: string | null;
  referralCode?: string | null;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    message: string;
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// Request types
export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Session types
export interface SessionResponse {
  success: boolean;
  data: {
    user: User;
  };
}
