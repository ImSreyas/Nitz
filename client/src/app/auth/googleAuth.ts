import { createClient } from "@/utils/supabase/client";

export async function googleAuthSignUp(userType: string) {
  const supabase = createClient();

  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `http://localhost:3000/auth/callback?userType=${userType}`,
    },
  });
}

export async function googleAuthLogin() {
  const supabase = createClient();

  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `http://localhost:3000/auth/callback`,
    },
  });
}
