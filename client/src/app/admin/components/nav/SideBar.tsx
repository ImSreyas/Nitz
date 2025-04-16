"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart2,
  Calendar,
  Code,
  FileText,
  Flag,
  HelpCircle,
  Home,
  List,
  MessageSquare,
  Plus,
  Settings,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

export default function ModeratorSidebar({
  nonVisiblePaths,
}: {
  nonVisiblePaths: string[];
}) {
  const pathname = usePathname();
  const tempHide = true;

  const isActive = (path: string) => pathname === path;
  if (tempHide) {
    return null;
  }

  if (
    nonVisiblePaths.some((path) => {
      if (pathname.startsWith(path.replace("*", ""))) return true;
    })
  ) {
    return null;
  }

  return (
    <Sidebar className="">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <Code className="h-6 w-6" />
          <div className="font-semibold">Bitz</div>
        </div>
      </SidebarHeader>
      <SidebarContent className="no-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/moderator")}>
                  <Link href="/moderator">
                    <Home />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/moderator/analytics")}
                >
                  <Link href="/analytics">
                    <Activity />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/reports")}>
                  <Link href="/reports">
                    <TrendingUp />
                    <span>Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Problem Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/moderator/problems")}
                >
                  <Link href="/moderator/problems">
                    <FileText />
                    <span>All Problems</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/moderator/create-problem")}
                >
                  <Link href="/moderator/create-problem">
                    <Plus />
                    <span>Create Problem</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/moderator/categories")}
                >
                  <Link href="/moderator/categories">
                    <Tag />
                    <span>Categories</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/moderator/test-cases")}
                >
                  <Link href="/moderator/test-cases">
                    <List />
                    <span>Test Cases</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Contest Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/moderator/contests")}
                >
                  <Link href="/moderator/contests">
                    <Calendar />
                    <span>All Contests</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/moderator/create-contest")}
                >
                  <Link href="/moderator/create-contest">
                    <Plus />
                    <span>Create Contest</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/moderator/leaderboards")}
                >
                  <Link href="/moderator/leaderboards">
                    <BarChart2 />
                    <span>Leaderboards</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>User Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/moderator/users")}
                >
                  <Link href="/moderator/users">
                    <Users />
                    <span>All Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/moderator/reports")}
                >
                  <Link href="/moderator/reports">
                    <Flag />
                    <span>Reports</span>
                  </Link>
                </SidebarMenuButton>
                <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white">
                  9
                </Badge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/moderator/feedback")}
                >
                  <Link href="/moderator/feedback">
                    <MessageSquare />
                    <span>Feedback</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/settings")}>
                  <Link href="/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/help")}>
                  <Link href="/help">
                    <HelpCircle />
                    <span>Help & Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
