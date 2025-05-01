"use client";

import Link from "next/link";
import { NavAllowedPaths } from "@/constants";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Flame, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const routes = [
  { href: "/problems", label: "Problems" },
  { href: "/contest", label: "Contest" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/groups", label: "Groups" },
  { href: "/discuss", label: "Discuss" },
];

export default function Nav() {
  const path = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUser(user);
      }
    }

    fetchUser();
  }, [supabase]);

  return NavAllowedPaths.includes(path) ? (
    <div className="backdrop-blur-xl bg-background/20 z-10 sticky -top-2 flex justify-center w-full h-fit px-8 pb-8 pt-10 border-b">
      <div className="fixed top-8 left-16 flex items-center">
        <div className="doto text-[1.8rem]">
          <span className="text-primary">B</span>ITZ
        </div>
      </div>
      <div className="fixed top-8 right-16 flex items-center space-x-6">
        <button>
          <Sparkles size={22} />
        </button>
        <button className="flex space-x-1 items-center">
          <Flame size={22} />
          <div className="h-fit translate-y-[2px] text-sm">1</div>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="p-0 w-10 h-10 rounded-2xl bg-muted"
            >
              {user?.user_metadata.avatar_url && (
                <Image
                  src={user?.user_metadata.avatar_url || "/placeholder.svg"}
                  alt="Avatar"
                  className="w-full h-full rounded-2xl"
                  width={100}
                  height={100}
                />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/profile">
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/settings">
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/login";
              }}
            >
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-x-8">
        {routes.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`${path === href && "text-primary"}`}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
}
