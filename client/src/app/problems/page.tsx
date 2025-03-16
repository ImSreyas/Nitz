"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import CodingProblems from "./components/Problems";

export default function Page() {
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

  console.log(user);

  return (
    <div className="px-16 py-10">
      <div id="main-container">
        <CodingProblems />
      </div>
    </div>
  );
}
