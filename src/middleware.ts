import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// Authenticated app areas. Everything else is public by default.
const protectedPrefixes = [
  "/home",
  "/accounts",
  "/projects",
  "/amenities",
  "/history",
  "/profile",
];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function middleware(request: NextRequest) {
  // Refresh auth cookies on (almost) every request so browser + server stay in sync.
  const { supabase, response } = await updateSession(request);

  // getUser() validates/refreshes the JWT and writes updated cookies via updateSession.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Only gate private app routes; login, auth callbacks, APIs, and marketing stay open.
  if (isProtectedPath(request.nextUrl.pathname) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Broad matcher so Supabase session cookies keep refreshing on public pages too.
     * Auth redirects are applied separately via protectedPrefixes above.
     * Skip Next internals and static assets.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
