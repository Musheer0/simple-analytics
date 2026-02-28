import { ANALYTICS_TIME, ANALYTICS_TIME_MS, TTL } from "@/constants";
import { getWebsiteById } from "@/features/websites/actions/query";
import { Visitor } from "@/generated/prisma/client";
import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { redisKeys } from "@/lib/redis-key-registry";
import { auth } from "@clerk/nextjs/server";
import { AnalyticsSummary, PageHistory, TrafficMetadata, UtmMetadata, WebsiteAnalytics } from "../types";
import { bigintToNumberJSON } from "@/lib/convert-bignt-to-num-json";
import { getPageVisitorSummary } from "./utils/get-page-visits-summary";
import { getUtmMetadata } from "./utils/get-utm-metadata";
import { getTrafficMetadata } from "./utils/get-traffic-metadata";
import { getPageHistory } from "./utils/get-page-history";
import { getAverageSessionTime } from "./utils/get-average-session-time";
import { getTrendAnalytics } from "./utils/get-trend-anaylitics";

export const getVisitor = async (
  websiteId: string,
  visitorId: string,
): Promise<Visitor | null> => {
  const cache = await redis.get<Visitor>(
    redisKeys.PIXEL_VISITOR_KEY(websiteId, visitorId),
  );
  if (cache) return cache;
  const visitor = await prisma.visitor.findFirst({
    where: {
      website_id: websiteId,
      id: visitorId,
    },
  });
  return visitor;
};
export const getBasicWebsiteAnalytics = async ({
  websiteId,
  duration,
  includeWebsite
}: {
  websiteId: string;
  duration: keyof typeof ANALYTICS_TIME;
  includeWebsite?: boolean;
}) => {

  if (!websiteId || !duration) throw new Error("invalid data");

  const { orgId } = await auth();
  const website = await getWebsiteById(websiteId);

  if (!website) throw new Error("Website not found");
  if (website.org_id !== orgId) throw new Error("Forbidden");

  const interval = ANALYTICS_TIME[duration];
  const cacheKey =
    redisKeys[`BASIC_WEBSITE_ANALYTICS_${duration}`](website.id);

  const cache = await redis.get<WebsiteAnalytics>(cacheKey);
  const days = Math.round(
  (ANALYTICS_TIME_MS[duration]) /
  (ANALYTICS_TIME_MS.ONE_DAY)
);
  if (cache){
    const trend = await getTrendAnalytics({websiteId:website.id,days:days})
    return includeWebsite ? { website, ...cache,trend:{visits:trend.pageViews,bounce_rate:trend.bounceRate,visitors:trend.visitors} } : cache;}

  // 🔥 Run all DB queries in parallel
  const [
    summary,
    utm,
    metadata,
    pages,
    avgSession
  ] = await Promise.all([
    getPageVisitorSummary(website.id, interval),
    getUtmMetadata(website.id, interval),
    getTrafficMetadata(website.id, interval),
    getPageHistory(website.id, interval),
    getAverageSessionTime(website.id, interval)
  ]);

  const result: Omit<WebsiteAnalytics,"trend"> = {
    ...summary,
    ...metadata,
    ...utm,
    pages,
    avg_session: avgSession
  };

  const parsed = bigintToNumberJSON(result);

  await redis.set(
    cacheKey,
    { ...parsed, duration, cached_at: new Date() },
    { ex: TTL.HOUR_1 }
  );
  const trend = await getTrendAnalytics({websiteId:website.id,days:days})
  return includeWebsite
    ? { website, ...parsed, duration ,trend:{visits:trend.pageViews,bounce_rate:trend.bounceRate,visitors:trend.visitors}}
    : { ...parsed, duration ,trend:{visits:trend.pageViews,bounce_rate:trend.bounceRate,visitors:trend.visitors}};
};