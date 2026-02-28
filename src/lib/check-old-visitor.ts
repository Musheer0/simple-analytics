import { NextRequest, NextResponse } from "next/server";
import { DecodePixelJwt } from "./sign-jwt";
import { getVisitor } from "@/features/analytics/actions/query";
import prisma from "./db";

export const checkOldVisitor = async (req: NextRequest) => {
  if (!process.env.PIXEL_COOKIE_NAME) return null;
  const cookie = req.cookies.get(process.env.PIXEL_COOKIE_NAME)?.value;
  if (!cookie) return null;
  const decoded = DecodePixelJwt(cookie);
  if (!decoded) return null;
  const visitor = await getVisitor(decoded.website_id, decoded.visitor_id);
  return visitor;
};
