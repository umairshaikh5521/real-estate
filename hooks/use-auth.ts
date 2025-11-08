/**
 * Auth Hooks
 * React Query hooks for authentication
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/lib/api/auth";
import type { SignupRequest, LoginRequest } from "@/types/auth";

// Query keys for caching
export const authKeys = {
  session: ["auth", "session"] as const,
  user: ["auth", "user"] as const,
};

/**
 * Hook to get current user session
 */
export function useSession() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: authService.getSession,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for user signup
 */
export function useSignup() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignupRequest) => authService.signup(data),
    onSuccess: (response) => {
      // Set session in cache
      queryClient.setQueryData(authKeys.session, {
        success: true,
        data: { user: response.data.user },
      });

      toast.success("Account created successfully!", {
        description: "Welcome to the platform",
      });

      // Redirect to saved path or dashboard
      const redirectPath = 
        typeof window !== "undefined" 
          ? sessionStorage.getItem("redirectAfterLogin") || "/dashboard"
          : "/dashboard";
      
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("redirectAfterLogin");
      }
      
      router.push(redirectPath);
    },
    onError: (error: any) => {
      const message =
        error?.message || "Failed to create account. Please try again.";
      
      toast.error("Signup failed", {
        description: message,
      });
    },
  });
}

/**
 * Hook for user login
 */
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      // Set session in cache
      queryClient.setQueryData(authKeys.session, {
        success: true,
        data: { user: response.data.user },
      });

      toast.success("Logged in successfully!", {
        description: `Welcome back, ${response.data.user.fullName}`,
      });

      // Redirect to saved path or dashboard
      const redirectPath = 
        typeof window !== "undefined" 
          ? sessionStorage.getItem("redirectAfterLogin") || "/dashboard"
          : "/dashboard";
      
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("redirectAfterLogin");
      }
      
      router.push(redirectPath);
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to login. Please try again.";
      
      toast.error("Login failed", {
        description: message,
      });
    },
  });
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();

      toast.success("Logged out successfully");

      // Redirect to login
      router.push("/login");
    },
    onError: () => {
      // Even if API call fails, clear local cache
      queryClient.clear();
      router.push("/login");
      
      toast.error("Logout failed", {
        description: "Session cleared locally",
      });
    },
  });
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  const { data, isLoading } = useSession();
  
  return {
    isAuthenticated: !!data?.data?.user,
    isLoading,
    user: data?.data?.user,
  };
}
