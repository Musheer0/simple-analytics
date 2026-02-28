import { TTL } from "@/constants";
import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { redisKeys } from "@/lib/redis-key-registry";
export type TrendAnalytics = {
  pageViews: number;
  visitors: number;
  bounceRate: number;
  trend: {
    bounceRate: number;
    pageViews: number;
    visitors: number;
    snapshot_at: Date;
  }[];
};
export const getTrendAnalytics = async ({
  websiteId,
  days,
}: {
  websiteId: string;
  days: number;
}) => {
  if (!websiteId || !days) throw new Error("Invalid params");

  const granularity = days <= 7 ? "hourly" : "daily";

  const cacheKey = redisKeys.TREND_ANALYTICS(websiteId, days, granularity);
  const cached = await redis.get<TrendAnalytics>(cacheKey);
  if (cached) return cached;

  const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const snapshots = await prisma.analyticsSnapshot.findMany({
    where: {
      websiteId,
      snapshot_at: {
        gte: fromDate,
      },
    },
    select: {
      bounceRate: true,
      pageViews: true,
      visitors: true,
      snapshot_at: true,
    },
    orderBy: {
      snapshot_at: "asc",
    },
  });

  if (!snapshots.length) {
    return {
      pageViews: 0,
      visitors: 0,
      bounceRate: 0,
      trend: [],
    };
  }

  const totalPageViews = snapshots.reduce((acc, s) => acc + s.pageViews, 0);

  const totalVisitors = snapshots.reduce((acc, s) => acc + s.visitors, 0);

  const avgBounce =
    snapshots.reduce((acc, s) => acc + s.bounceRate, 0) / snapshots.length;

  const result = {
    pageViews: totalPageViews,
    visitors: totalVisitors,
    bounceRate: Number(avgBounce.toFixed(2)),
    trend: snapshots,
  };

  await redis.set(cacheKey, result, {
    ex: TTL.HOUR_1,
  });

  return result;
};
