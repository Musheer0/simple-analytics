import {
  createEvent,
  endVisitorSession,
} from "@/features/analytics/actions/mutation";
import { resolveRequestContext } from "./resolve-request";
import { NextRequest, NextResponse } from "next/server";
import { getVisitorSessionFromCookie } from "@/features/analytics/lib/get-visitor-session-cookie";
import { redisKeys } from "@/lib/redis-key-registry";
import { redis } from "@/lib/redis";
import { VisitorSessionCache } from "@/features/analytics/types";

export async function handlePageUnBlur(
  req: NextRequest,
  context: Awaited<ReturnType<typeof resolveRequestContext>>,
) {
  const { pixelCookie } = context!;
  const sessionId = getVisitorSessionFromCookie(req);
  if (!sessionId) return NextResponse.json({ success: false }, { status: 400 });
  const response = NextResponse.json({ sessionId }, { status: 200 });
  const cache = await redis.get<VisitorSessionCache>(
    redisKeys.PIXEL_VISITOR_SESSION_KEY(sessionId),
  );
  if (!cache) {
    await redis.set(
      redisKeys.PIXEL_VISITOR_SESSION_KEY(sessionId),
      {
        visitor: pixelCookie.visitor_id,
        session_id: sessionId,
        last_heartbeat: new Date(),
        blur: {
          stated: new Date(),
          ended: new Date(Date.now() + 1000 * 60 * 30), //no cache  = more than 30mins of tab ignored
        },
      },
      { ex: 1000 * 60 * 30 },
    );
    return response;
  }
  await redis.set(
    redisKeys.PIXEL_VISITOR_SESSION_KEY(sessionId),
    {
      visitor: pixelCookie.visitor_id,
      session_id: sessionId,
      last_heartbeat: new Date(),
      blur: {
        stated: cache.blur.started,
        ended: new Date(),
      },
    },
    { ex: 1000 * 60 * 30 },
  );
  return response;
}
