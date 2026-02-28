import {
  createEvent,
  endVisitorSession,
} from "@/features/analytics/actions/mutation";
import { resolveRequestContext } from "./resolve-request";
import { NextRequest, NextResponse } from "next/server";
import { getVisitorSessionFromCookie } from "@/features/analytics/lib/get-visitor-session-cookie";
import { redisKeys } from "@/lib/redis-key-registry";
import { redis } from "@/lib/redis";
import { inngest } from "@/inngest/client";

export async function handlePathChange(
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
  const response = NextResponse.json({ sessionId }, { status: 200 });
  await redis.set(
    redisKeys.PIXEL_VISITOR_SESSION_KEY(sessionId),
    {
      visitor: pixelCookie.visitor_id,
      session_id: sessionId,
      last_heartbeat: new Date(),
    },
    { ex: 1000 * 60 * 30 },
  );
  await inngest.send({
    name: "analytics/update_analytics",
    data: {
      type: parsed.type,
      path_changes: parsed.path_history||[],
      website_id: website.id,
    },
  });
  return response;
}
