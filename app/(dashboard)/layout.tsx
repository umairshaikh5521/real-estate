"use client";

/**
 * Dashboard Layout
 * Protected layout that requires authentication
 * Contains sidebar, header, and main content area
 */

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { NavUser } from "@/components/nav-user";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useSession } from "@/hooks/use-auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardContent>{children}</DashboardContent>
    </ProtectedRoute>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { data } = useSession();
  
  // Get user data from session
  const user = data?.data?.user;

  // Default user data while loading
  const userData = user
    ? {
        name: user.fullName,
        email: user.email,
        avatar: user.avatar || "",
      }
    : {
        name: "User",
        email: "user@example.com",
        avatar: "",
      };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative overflow-auto max-h-[calc(100vh-1rem)] hide-scrollbar">
        <header className="flex justify-between pt-2 pb-3 shrink-0 items-center gap-2 px-4 border-b sticky top-0 z-50 bg-white">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div className="relative hidden md:block">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search project, leads, units..."
                className="pl-9 w-84 h-11 border-[#E0E2EA]"
              />
            </div>
          </div>

          <div className="max-w-[280px]">
            <NavUser user={userData} />
          </div>
        </header>
        <div className="p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
