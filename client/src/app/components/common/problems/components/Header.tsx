import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, Flame, Settings, Trophy, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRoleStore } from "@/lib/store/useRoleStore";
import LogoutComponent from "../../LogoutComponent";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { getUserPoints } from "@/lib/api/common";
import Image from "next/image";

const profilePaths = {
  admin: "/admin/profile",
  moderator: "/moderator/profile",
  user: "/user/profile",
};

export default function Header() {
  const [userPoints, setUserPoints] = useState(0);
  const supabase = createClient();
  const { context } = useRoleStore();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
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
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log("Error fetching user:", error);
      } else {
        setUser(data);
      }
    };
    const fetchUserPoints = async () => {
      const response = await getUserPoints();
      if (response?.data?.success) {
        setUserPoints(response.data.data);
      }
    };

    fetchUser();
    fetchUserPoints();
    findRank();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const handleProfileClick = () => {
    router.push(profilePaths[context]);
  };

  return (
    <div className=" w-fit flex items-center gap-4">
      {context === "user" && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex gap-2 items-center">
                <div className="">
                  <Image
                    src="/icons/coin3.png"
                    width={25}
                    height={25}
                    alt="points"
                  />
                </div>
                <div className="translate-y-[1px]">{userPoints}</div>
              </button>
            </TooltipTrigger>
            <TooltipContent>Total Points</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="mx-1 bg-transparent text-foreground flex items-center justify-center gap-2">
                <Trophy size={18} className="" />
                <div className="translate-y-[1px] text-sm">{userRank}</div>
              </button>
            </TooltipTrigger>
            <TooltipContent>Your Rank</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex space-x-1 items-center">
                <Flame
                  size={22}
                  className="-translate-y-[1px] text-[#ff6a00]"
                />
                <div className="h-fit translate-y-[1px] text-sm">1</div>
              </button>
            </TooltipTrigger>
            <TooltipContent>Your Rank</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              {context === "admin" ? (
                <AvatarFallback>AD</AvatarFallback>
              ) : (
                <AvatarFallback>JD</AvatarFallback>
              )}
            </Avatar>
            {context === "admin" ? (
              <div className="text-sm font-medium">Admin</div>
            ) : (
              <div className="text-sm font-medium">
                {user?.user.user_metadata.name || "User"}
              </div>
            )}
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleProfileClick}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          {context === "admin" && (
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          )}
          <LogoutComponent />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
