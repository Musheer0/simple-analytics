import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const SECRET = process.env.JWT_SECRET || "super-secret-key";

type Payload = {
  visitor_id: string;
  website_id: string;
};

export function signJwtInfinite(data: Payload): string {
  return jwt.sign(data, SECRET);
}
export function DecodePixelJwt(data: string): Payload | null {
  const isvalid = jwt.verify(data, SECRET);
  if (typeof isvalid === "string") return null;

  return isvalid as Payload;
}
export function getPixelCookiePayload(req: NextRequest): Payload | null {
  const cookieName = process.env.PIXEL_COOKIE_NAME;

  if (!cookieName) return null;

  const raw = req.cookies.get(cookieName)?.value;
  if (!raw) return null;

  const decoded = DecodePixelJwt(raw);
  if (!decoded) return null;

  if (!decoded.website_id || !decoded.visitor_id) return null;

  return {
    website_id: decoded.website_id,
    visitor_id: decoded.visitor_id,
  };
}
