"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { Lock } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

export default function LogoutComponent() {
  const supabase = createClient();
  const router = useRouter();

  const handleClick = async () => {
    const response = await supabase.auth.signOut();
    if (response.error) {
      console.error("Error signing out:", response.error.message);
      router.push("/login");
    } else {
      router.push("/login");
    }
  };
  return (
    <DropdownMenuItem onClick={handleClick}>
      <Lock className="mr-2 h-4 w-4" />
      <span>Log out</span>
    </DropdownMenuItem>
  );
}
