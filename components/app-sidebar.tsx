"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  Building2,
  Calendar,
  FileText,
  LayoutDashboard,
  Megaphone,
  Settings,
  UserLock,
  Users,
} from "lucide-react";

import logoIcon from "@/public/logo-icon.svg";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: pathname === "/dashboard" || pathname === "/",
      },
      {
        title: "Projects",
        url: "/projects",
        icon: Building2,
        isActive: pathname.startsWith("/projects"),
      },
      {
        title: "Leads",
        url: "/leads",
        icon: Users,
        isActive: pathname.startsWith("/leads"),
      },
      {
        title: "Booking",
        url: "/bookings",
        icon: Calendar,
        isActive: pathname.startsWith("/bookings"),
      },
      {
        title: "Agents",
        url: "/agents",
        icon: UserLock,
        isActive: pathname.startsWith("/agents"),
      },
      {
        title: "Documents",
        url: "/documents",
        icon: FileText,
        isActive: pathname.startsWith("/documents"),
      },
      {
        title: "Marketing",
        url: "/marketing",
        icon: Megaphone,
        isActive: pathname.startsWith("/marketing"),
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        isActive: pathname.startsWith("/settings"),
      },
    ],
    navSecondary: [
      {
        title: "Notifications",
        url: "/notifications",
        icon: Bell,
        isActive: pathname.startsWith("/notifications"),
      },
    ],
  };
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <Image src={logoIcon} alt="Logo Icon" className="size-8" />
                <div className="grid flex-1 text-left text-3xl leading-tight">
                  <span
                    className="truncate font-semibold"
                    style={{ fontFamily: "var(--font-afacad)" }}
                  >
                    Zameen
                  </span>
                  {/* <span className="truncate text-xs">Enterprise</span> */}
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <div className="bg-white rounded-sm">
          <NavUser user={data.user} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
