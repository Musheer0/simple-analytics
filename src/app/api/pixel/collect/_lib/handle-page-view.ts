import {
  createEvent,
  createVisitorSession,
} from "@/features/analytics/actions/mutation";
import { resolveRequestContext } from "./resolve-request";
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { redisKeys } from "@/lib/redis-key-registry";
import { inngest } from "@/inngest/client";
import { corsHeaders } from "@/lib/set-cors-header";

export async function handlePageView(
  req: NextRequest,
  context: Awaited<ReturnType<typeof resolveRequestContext>>,
) {
  const { parsed, website, pixelCookie } = context!;
  if (!website) return NextResponse.json({ success: false }, { status: 400 });
  const sessionId = await createVisitorSession({
    visitorId: pixelCookie.visitor_id,
    websiteId: website.id,
    screenWidth: parsed.screenWidth,
    utmCampaign: parsed.utm_campaign || "",
    utmSource: parsed.utm_source || "",
  });
   if(!parsed.url.endsWith('/')) {
    if(parsed.path_history) parsed.path_history.push(parsed.url)
    else parsed.path_history = [parsed.url]
   }
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
  await inngest.send({
    name: "analytics/update_analytics",
    data: {
      ...parsed,
      page_view: {
        utm_campaign:parsed.utm_campaign,
        utm_source:parsed.utm_source
      },
      website_id: website.id,
    },
    
  });
  const response = NextResponse.json({ sessionId }, { status: 200,headers:corsHeaders(website.domain) });

  response.cookies.set(
    process.env.PIXEL_SESSION_COOKIE_NAME || "visitor_session",
    sessionId,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  );
  await redis.set(
    redisKeys.PIXEL_VISITOR_SESSION_KEY(sessionId),
    {
      visitor: pixelCookie.visitor_id,
      session_id: sessionId,
      last_heartbeat: new Date(),
    },
    { ex:  60 * 30 },
  );
  return response;
}
