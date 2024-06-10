import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// Public routes
const publicPaths = ['/', '/login', '/error'];

export async function middleware(request: NextRequest) {
  // update user's auth session
  const { supabase, response } = await updateSession(request);

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname === path);
  // console.log("where:", request.nextUrl.pathname)
  // console.log("user:", user)
  // console.log("isPublicPath:", isPublicPath)

  if (!user  && !isPublicPath) {
    console.log('You are not logged in')
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
