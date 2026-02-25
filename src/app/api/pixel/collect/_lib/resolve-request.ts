import { validateEventBody } from "@/features/analytics/schemas/pixel-schema";
import { getPixelCookiePayload } from "@/lib/sign-jwt";
import { verifyPixel } from "@/lib/verify-pixel";
import { NextRequest } from "next/server";

export async function resolveRequestContext(req: NextRequest) {
  const body = await req.json();
  const parsed = validateEventBody(body);
  if (!parsed) return null;

  const origin = req.headers.get("referer");
  const userAgent = req.headers.get("user-agent");
  if (!origin || !userAgent) return null;
  const pixelCookie = getPixelCookiePayload(req);
  if (!pixelCookie) return null;
  if (parsed.type == "HEARTBEAT")
    return {
      parsed,
      pixelCookie,
    };
  const website = await verifyPixel(parsed.website_id, origin);
  if (!website) return null;

  return {
    parsed,
    website,
    pixelCookie,
  };
}
