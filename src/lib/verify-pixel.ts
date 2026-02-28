import { getWebsiteById } from "@/features/websites/actions/query";
import { NextRequest, NextResponse } from "next/server";

export const verifyPixel = async (websiteId: string, origin: string) => {
  const website = await getWebsiteById(websiteId);
  if (!website) return null;
  if (!origin.includes(website.domain)) return null;
  return website;
};
