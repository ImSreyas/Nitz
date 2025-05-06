"use client";

import React from "react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
import { ChevronDown, Settings } from "lucide-react";
// import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import LogoutComponent from "@/app/components/common/LogoutComponent";
import Link from "next/link";

export default function Header({
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
    <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b bg-background px-6">
      {/* <SidebarTrigger /> */}
      <div className="w-full flex-1 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            {/* <Badge variant="outline" className="ml-2">
              Beta
            </Badge> */}
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Avatar" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-medium">Admin</div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem> */}
                <Link href="/admin/settings">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
                <LogoutComponent />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
