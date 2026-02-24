import {
  createEvent,
  endVisitorSession,
} from "@/features/analytics/actions/mutation";
import { resolveRequestContext } from "./resolve-request";
import { NextRequest, NextResponse } from "next/server";
import { getVisitorSessionFromCookie } from "@/features/analytics/lib/get-visitor-session-cookie";
import { redisKeys } from "@/lib/redis-key-registry";
import { redis } from "@/lib/redis";

export async function handlePageExit(
  req: NextRequest,
  context: Awaited<ReturnType<typeof resolveRequestContext>>,
) {
  const { parsed, website, pixelCookie } = context!;
  if (!website) return NextResponse.json({ success: false }, { status: 400 });
  const sessionId = getVisitorSessionFromCookie(req);
  if (!sessionId) return NextResponse.json({ success: false }, { status: 400 });

  await createEvent({
    type: parsed.type,
    sessionId,
    url: parsed.url,
    visitorId: pixelCookie.visitor_id,
    websiteId: website.id,
    activeTime: parsed.active_time,
    rawPayload: parsed,
    pathHistory: parsed.path_history,
  });

  await endVisitorSession(sessionId);

  const response = NextResponse.json({ sessionId }, { status: 200 });
  response.cookies.delete(process.env.PIXEL_SESSION_COOKIE_NAME!);
  await redis.del(redisKeys.PIXEL_VISITOR_SESSION_KEY(sessionId));
  return response;
}
