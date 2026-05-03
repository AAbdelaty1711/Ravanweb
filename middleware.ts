import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Route groups ─────────────────────────────────────────────────────────────
const PUBLIC_PATHS = ["/", "/login", "/register", "/forgot-password", "/verify", "/reset-password"];

/**
 * Auth guard middleware.
 *
 * In production, replace the mock `isAuthenticated` logic with your real
 * session check — e.g. reading a JWT cookie or calling an auth provider.
 *
 * For this demo build:
 *  - A cookie `raven_session` being present = authenticated
 *  - If absent, redirect to /login unless already on a public path
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths without any auth check
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  // Allow Next.js internals and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(png|jpg|svg|ico|webp|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Check mock session cookie
  const session = request.cookies.get("raven_session");

  if (!session) {
    // Not authenticated → redirect to login, preserving the intended path
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Apply to all routes except Next.js internals and static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
