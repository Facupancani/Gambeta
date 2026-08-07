import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { decryptSession, getSessionCookie } from "@/lib/session";

/**
 * Data Access Layer — the single place that checks "is this admin logged in".
 * Every admin page, Server Action, and Route Handler should call this instead
 * of re-implementing the check, so the auth logic can't drift between routes.
 * (proxy.ts also does a cheap "optimistic" check, but this is the real one.)
 */
export const verifySession = cache(async () => {
  const token = await getSessionCookie();
  const session = await decryptSession(token);

  if (!session?.adminId) {
    redirect("/admin/login");
  }

  return session;
});

/** Same check, but returns null instead of redirecting — for optional UI branches. */
export const getOptionalSession = cache(async () => {
  const token = await getSessionCookie();
  return decryptSession(token);
});
