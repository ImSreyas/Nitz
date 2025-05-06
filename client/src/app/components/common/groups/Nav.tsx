"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Trophy, Flame, ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function NavBar() {
  const supabase = createClient();
  const [userPoints, setUserPoints] = useState(0);
  const [userRank, setUserRank] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  // Fetch user points and rank
  const fetchUserDetails = async () => {
    try {
      // Fetch all users sorted by points
      const { data: users, error: usersError } = await supabase
        .from("tbl_users")
        .select("id, points")
        .order("points", { ascending: false });

      if (usersError) {
        console.error("Error fetching users:", usersError);
        return;
      }

      // Get the current user
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.user) {
        console.error("Error fetching current user:", userError);
        return;
      }

      const currentUserId = user.user.id;

      // Find the rank of the current user
      const rank = users.findIndex((u) => u.id === currentUserId) + 1;

      // Get the points of the current user
      const currentUser = users.find((u) => u.id === currentUserId);

      setUserRank(rank);
      setUserPoints(currentUser?.points || 0);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="backdrop-blur-xl bg-background/20 z-40 sticky top-0 flex justify-between items-center w-full h-24 px-16">
      {/* Logo */}
      <div className="flex items-center">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="!p-5 rounded-xl bg-card"
        >
          <ArrowLeft size={20} className="text-muted-foreground" />
        </Button>
      </div>

      {/* User Details */}
      <div className="flex items-center space-x-6">
        <button className="flex gap-2 items-center">
          <Image src="/icons/coin3.png" width={25} height={25} alt="points" />
          <div>{userPoints}</div>
        </button>
        <button className="flex items-center gap-2">
          <Trophy size={18} />
          <div>{userRank}</div>
        </button>
        <button className="flex items-center gap-2">
          <Flame size={22} className="text-[#ff6a00]" />
          <div>1</div>
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
    </div>
  );
}
