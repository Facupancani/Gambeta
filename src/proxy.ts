import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decryptSession } from "@/lib/session";

const COOKIE_NAME = "gambeta_session";

/**
 * Optimistic auth check for /admin routes (Next.js 16 renamed "Middleware" to
 * "Proxy" — same mechanism, this file replaces what used to be middleware.ts).
 *
 * This only reads the session cookie — no DB call — so it's cheap enough to
 * run on every request. It's a fast redirect, not the real security boundary:
 * every Server Action and admin data call still calls verifySession() from
 * src/lib/dal.ts, which is what actually protects the data.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = await decryptSession(token);

  if (!session && !isLoginRoute) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (session && isLoginRoute) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
