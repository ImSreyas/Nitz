"use client";

import React from "react";
import NavLink from "./NavLink";
import {
  BarChart3,
  Users,
  Shield,
  AlertTriangle,
  FileText,
  Bell,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function NavBar({
  nonVisiblePaths,
}: {
  nonVisiblePaths: string[];
}) {
  const pathname = usePathname();

  if (
    nonVisiblePaths.some((path) => {
      if (pathname.startsWith(path.replace("*", ""))) return true;
    })
  ) {
    return null;
  }

  return (
    <div className="w-full flex justify-center items-center p-6">
      <div className="flex w-fit bg-card rounded-2xl p-2 gap-1">
        <NavLink href="/admin" icon={BarChart3} label="Overview" />
        <NavLink href="/admin/users" icon={Users} label="Users" />
        <NavLink href="/admin/moderators" icon={Shield} label="Moderators" />
        <NavLink href="/admin/problems" icon={FileText} label="Problems" />
        <NavLink href="/admin/reports" icon={AlertTriangle} label="Reports" />
        <NavLink
          href="/admin/notifications"
          icon={Bell}
          label="Notifications"
        />
        <NavLink href="/admin/settings" icon={Settings} label="Settings" />
      </div>
    </div>
  );
}
