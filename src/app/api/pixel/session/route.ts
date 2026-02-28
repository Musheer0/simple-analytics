import { verifyPixel } from "@/lib/verify-pixel";
import { checkOldVisitor } from "@/lib/check-old-visitor";
import { NextRequest, NextResponse } from "next/server";
import { handleNewVisitor } from "@/features/analytics/lib/handle-new-visitor";
export function corsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin ?? "",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}
export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const origin = req.headers.get("origin");
  const user_agent = req.headers.get("user-agent");

  if (!origin) return NextResponse.json({ success: false }, { status: 400 });
  if (!user_agent)
    return NextResponse.json({ success: false }, { status: 400 });

  const website = await verifyPixel(body.website_id, origin);
  if (!website) return NextResponse.json({ success: false }, { status: 404 });

  const oldVisitor = await checkOldVisitor(req);
  if (oldVisitor) {
    return NextResponse.json(null, {
      status: 200,
      headers: corsHeaders(origin),
    });
  }
  const newVisitorResponseWithCookie = await handleNewVisitor(req, {
    user_agent,
    origin,
    website,
  });
  return newVisitorResponseWithCookie;
};
