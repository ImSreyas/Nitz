import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

function generateRandomHex(length: number) {
  const characters = "0123456789abcdef";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const userType = searchParams.get("userType") ?? null;

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    if (exchangeError) {
      console.error("Error exchanging code for session:", exchangeError);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error getting user:", userError);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const userId = user?.id;
    if (!userId) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    const fullName = user?.user_metadata?.full_name || "user";
    const randomHex = generateRandomHex(8);
    const uniqueUsername = `${fullName}-${randomHex}`.slice(0, 30);

    if (userType == "moderator") {
      const { data: existingUser } = await supabase
        .from("tbl_moderators")
        .select("id")
        .eq("id", userId)
        .single();

      if (existingUser) {
        return NextResponse.redirect(`${origin}/moderator`);
      }

      const { error: addModeratorError } = await supabase.rpc(
        "add_moderator_with_role",
        {
          p_id: userId,
          p_username: uniqueUsername,
          p_email: user?.email,
        }
      );

      if (addModeratorError) {
        console.error("Error adding moderator:", addModeratorError);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }

      return NextResponse.redirect(`${origin}/moderator`);
    } else if (userType == "user") {
      const { data: existingUser } = await supabase
        .from("tbl_users")
        .select("id")
        .eq("id", userId)
        .single();

      if (existingUser) {
        return NextResponse.redirect(`${origin}/problems`);
      }

      const { error: addUserError } = await supabase.rpc("add_user_with_role", {
        p_id: userId,
        p_username: uniqueUsername,
        p_email: user?.email,
      });

      if (addUserError) {
        console.error("Error adding user:", addUserError);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }

      return NextResponse.redirect(`${origin}/problems`);
    } else {
      const { data: existingUser } = await supabase
        .from("tbl_users")
        .select("id")
        .eq("id", userId)
        .single();
      if (existingUser) {
        return NextResponse.redirect(`${origin}/problems`);
      }

      const { data: existingModerator } = await supabase
        .from("tbl_moderators")
        .select("id")
        .eq("id", userId)
        .single();
      if (existingModerator) {
        return NextResponse.redirect(`${origin}/moderator`);
      }

      const { error: addUserError } = await supabase.rpc("add_user_with_role", {
        p_id: userId,
        p_username: uniqueUsername,
        p_email: user?.email,
      });

      if (addUserError) {
        console.error("Error adding user:", addUserError);
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/login?error=googleSignIn`);
      } else {
        return NextResponse.redirect(`${origin}/problems`);
      }
    }
  }

  console.error("Authorization code not found");
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
