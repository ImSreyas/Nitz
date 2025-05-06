"use client";

import Link from "next/link";
import { NavAllowedPaths } from "@/constants";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Flame, Trophy } from "lucide-react";
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
import { getUserPoints } from "@/lib/api/common";

const routes = [
  { href: "/problems", label: "Problems" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/groups", label: "Groups" },
  { href: "/profile", label: "Profile" },
];

export default function Nav() {
  const [userPoints, setUserPoints] = useState(0);
  const path = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [userRank, setUserRank] = useState(0);

  const findRank = async () => {
    const { data: users, error } = await supabase
      .from("tbl_users")
      .select("id, points")
      .order("points", { ascending: false });

    if (error) {
      console.log("Failed to fetch users:", error);
    } else {
      const user = await supabase.auth.getUser();
      const userId = user.data?.user?.id;

      const rank = users.findIndex((user) => user.id === userId) + 1;

      if (rank === 0) {
        console.log("User not found in the ranking list");
      } else {
        setUserRank(rank);
      }
    }
  };

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

    async function fetchPoints() {
      const response = await getUserPoints();
      if (response?.data?.success) {
        setUserPoints(response.data.data);
      } else {
        console.error("Failed to fetch user points.");
      }
    }

    fetchUser();
    fetchPoints();
    findRank();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  return NavAllowedPaths.includes(path) ? (
    <div className="backdrop-blur-xl bg-background/20 z-40 sticky -top-2 flex justify-center w-full h-fit px-8 pb-8 pt-10 border-b">
      <div className="fixed top-8 left-16 flex items-center">
        <div className="doto text-[1.8rem]">
          <span className="text-primary">B</span>ITZ
        </div>
      </div>
      <div className="fixed top-8 right-16 flex items-center space-x-6">
        <button className="flex gap-2 items-center">
          <div className="">
            <Image src="/icons/coin3.png" width={25} height={25} alt="points" />
          </div>
          <div className="translate-y-[1px]">{userPoints}</div>
        </button>
        <button className="mx-1 bg-transparent text-foreground flex items-center justify-center gap-2">
          <Trophy size={18} className="" />
          <div className="translate-y-[1px] text-sm">{userRank}</div>
        </button>
        <button className="flex space-x-1 items-center">
          <Flame size={22} className="-translate-y-[1px] text-[#ff6a00]" />
          <div className="h-fit translate-y-[1px] text-sm">1</div>
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
            <Link href="/profile">
              <DropdownMenuItem>
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>
            {/* <Link href="/settings">
              <DropdownMenuItem>
                <span>Settings</span>
              </DropdownMenuItem>
            </Link> */}
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
