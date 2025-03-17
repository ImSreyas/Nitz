"use client"

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  console.log(user);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      console.log(user);
    };

    getUser();
  }, []);

  return (
    <div className="font-medium">
      <Button variant="outline" className="p-0 fixed right-16 top-6">
        <Link href="/login" className="px-6 py-2">
          Login
        </Link>
      </Button>
    </div>
  );
}
