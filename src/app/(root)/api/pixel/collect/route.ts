import { NextRequest, NextResponse } from "next/server";
import { resolveRequestContext } from "./_lib/resolve-request";
import { handlePageView } from "./_lib/handle-page-view";
import { handlePageExit } from "./_lib/handle-page-exit";
import { handlePathChange } from "./_lib/handle-path-change";
import { handlePageBlur } from "./_lib/handle-page-blur";
import { handlePageUnBlur } from "./_lib/handle-page-unblur";
import { handleHeartBeat } from "./_lib/handle-heartbeat";
const eventHandlers = {
  PAGE_VIEW: handlePageView,
  PAGE_EXIT: handlePageExit,
  PATH_CHANGE: handlePathChange,
  PAGE_BLUR: handlePageBlur,
  PAGE_UNBLUR: handlePageUnBlur,
  HEARTBEAT: handleHeartBeat,
} as const;
export const POST = async (req: NextRequest) => {
  const context = await resolveRequestContext(req);
  if (!context) return NextResponse.json({ success: false }, { status: 400 });

  const eventType = context.parsed.type.toUpperCase();
  console.log(eventType);
  const handler = eventHandlers[eventType as keyof typeof eventHandlers];
  if (!handler) return NextResponse.json({ success: false }, { status: 400 });

  return handler(req, context);
};
