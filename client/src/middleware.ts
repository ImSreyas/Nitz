import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";
import { createClient } from "./utils/supabase/server";

const isSecurePath = (paths: string[], request: NextRequest) => {
  return paths.some((path) => request.nextUrl.pathname.startsWith(path));
};

export async function middleware(request: NextRequest) {
  await updateSession(request);
  const response = NextResponse.next();
  const supabase = await createClient();

  // Get the user session
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError) {
    console.error("Error fetching session:", sessionError);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Secure paths
  const securePaths = ["/admin", "/moderator"];

  // Check if the current path is secure
  const isSecure = isSecurePath(securePaths, request);

  // If the user is not authenticated and tries to access a secure path, redirect to login
  if (!user && isSecure) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If the user is authenticated and tries to access a secure path
  if (user && isSecure) {
    // Fetch the user's role from the database
    const { data: userRole, error: roleError } = await supabase
      .from("tbl_user_roles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError) {
      console.error("Error fetching user role:", roleError);
      return NextResponse.redirect(new URL("/403", request.url));
    }

    const { role } = userRole as { role: "user" | "admin" | "moderator" };

    // Role-based access control
    const rolePaths = {
      user: ["/problems", "/contest", "/leaderboard", "/groups", "/discuss"],
      admin: ["/admin"],
      moderator: ["/moderator"],
    };

    const allowedPaths = rolePaths[role] || [];

    const isAllowedPath = allowedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    if (!isAllowedPath) {
      return NextResponse.redirect(new URL("/403", request.url));
    }

    // Check if the current path is secure and if the user has the correct role
    if (
      (request.nextUrl.pathname.startsWith("/admin") && role !== "admin") ||
      (request.nextUrl.pathname.startsWith("/moderator") && role !== "moderator")
    ) {
      return NextResponse.redirect(new URL("/403", request.url));
    }
  }

  return response;
}

// Apply middleware to all paths except static files and API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};