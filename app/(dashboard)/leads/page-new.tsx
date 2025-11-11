"use client";

/**
 * Leads Page - Router Component
 * Routes to appropriate view based on user role
 * Production-grade role-based access control
 */

import { useSession } from "@/hooks/use-auth";
import { UserRole } from "@/types/auth";
import { ChannelPartnerView, BuilderView } from "@/components/leads";
import { Loader2 } from "lucide-react";

export default function LeadsPage() {
  const { data: sessionData, isLoading } = useSession();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const user = sessionData?.data?.user;

  // Unauthorized state
  if (!user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">Unauthorized Access</p>
          <p className="text-sm text-muted-foreground">
            Please log in to view leads
          </p>
        </div>
      </div>
    );
  }

  // Role-based routing
  switch (user.role) {
    case UserRole.CHANNEL_PARTNER:
      return <ChannelPartnerView />;

    case UserRole.BUILDER:
    case UserRole.ADMIN:
      return <BuilderView />;

    default:
      return (
        <div className="flex h-[50vh] items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">Invalid Role</p>
            <p className="text-sm text-muted-foreground">
              Your account role is not authorized to view leads
            </p>
          </div>
        </div>
      );
  }
}
