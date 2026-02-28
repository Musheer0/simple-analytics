import { NextRequest } from "next/server";

export function getVisitorSessionFromCookie(req: NextRequest): string | null {
  const cookieName = process.env.PIXEL_SESSION_COOKIE_NAME;

  if (!cookieName) return null;

  const value = req.cookies.get(cookieName)?.value;

  if (!value) return null;

  // basic sanity check (cuid-like format or reasonable length)
  if (value.length < 10 || value.length > 100) {
    return null;
  }

  return value;
}
