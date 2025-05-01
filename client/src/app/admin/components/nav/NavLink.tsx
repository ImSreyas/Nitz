"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function NavLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  const pathname = usePathname();

  const isActive =
    pathname === href || (pathname.startsWith(href) && href !== "/admin");

  return (
    <Link
      href={href}
      className={`flex items-center text-sm gap-2 px-3 py-1 rounded-md ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted text-muted-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline-block translate-y-[1px]">{label}</span>
    </Link>
  );
}
