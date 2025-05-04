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
import { ChevronDown, Settings, Sparkles, Trophy, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRoleStore } from "@/lib/store/useRoleStore";
import LogoutComponent from "../../LogoutComponent";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const profilePaths = {
  admin: "/admin/profile",
  moderator: "/moderator/profile",
  user: "/user/profile",
};

export default function Header() {
  const supabase = createClient();
  const { context } = useRoleStore();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log("Error fetching user:", error);
      } else {
        setUser(data);
      }
    };
    fetchUser();
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
              <button className="mx-2 bg-transparent text-foreground flex items-center justify-center gap-2">
                <Sparkles size={18} />
                <div className="translate-y-[1px] text-sm">1814</div>
              </button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="mx-1 bg-transparent text-foreground flex items-center justify-center gap-2">
                <Trophy size={18} />
                <div className="translate-y-[1px] text-sm">1287</div>
              </button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
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
