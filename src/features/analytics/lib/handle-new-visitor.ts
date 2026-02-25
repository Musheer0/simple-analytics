import { Website } from "@/generated/prisma/client";
import prisma from "@/lib/db";
import { getCountryCode } from "@/lib/get-country-code";
import { redis } from "@/lib/redis";
import { redisKeys } from "@/lib/redis-key-registry";
import { signJwtInfinite } from "@/lib/sign-jwt";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
export const handleNewVisitor = async (
  req: NextRequest,
  {
    user_agent,
    website,
    origin,
  }: {
    user_agent: string;
    website: Website;
    origin: string;
  },
) => {
  const searchParams = req.nextUrl.searchParams;
  const referer = req.headers.get("referer");
  const ip = req.headers.get("x-forwarded-for") || "";
  const utm_campaign = searchParams.get("utm_campaign") || "";
  const utm_source = searchParams.get("utm_source") || "";
  const parser = new UAParser(user_agent) || "";
  const browser = parser.getBrowser().name || "";
  const os = parser.getOS().name || "";
  const device_type = parser.getDevice().type || "desktop";
  const country_code = await getCountryCode(ip);
  const visitor = await prisma.visitor.create({
    data: {
      website_id: website.id,
      first_page: origin,
      referrer: referer || "",
      browser,
      os,
      user_agent,
      ip,
      utm_campaign,
      utm_source,
      device_type,
      country_code: country_code,
    },
  });
  await redis.set(redisKeys.PIXEL_VISITOR_KEY(website.id, visitor.id), visitor);
  const jwt_payload = {
    visitor_id: visitor.id,
    website_id: website.id,
  };
  const jwt_token = signJwtInfinite(jwt_payload);
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set("_visitor_sa", jwt_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
};
