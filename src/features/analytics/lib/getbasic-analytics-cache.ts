import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { redisKeys } from "@/lib/redis-key-registry";
import { createInitialAnalytics } from "./create-initial-analytic-state";
import { transformBasicWebsiteAnalytics } from "./transform-basic-analytics";
import { BasicWebsiteAnalyticsSchemaType } from "../schemas/analytics-schema";

export const getBasicWebsiteAnalytics = async (
  websiteId: string,
): Promise<BasicWebsiteAnalyticsSchemaType> => {
  const redisKey = redisKeys.BASIC_WEBSITE_ANALYTICS(websiteId);

  const cached = await redis.get<BasicWebsiteAnalyticsSchemaType>(redisKey);

  if (cached) return cached;

  let dbAnalytics = await prisma.basicWebsiteAnalytics.findUnique({
    where: { websiteId },
  });

  if (!dbAnalytics) {
    const initial = createInitialAnalytics();

    await prisma.basicWebsiteAnalytics.create({
      data: {
        websiteId,
      },
    });

    await redis.set(redisKey, initial, { ex: 86400 });
    return initial;
  }

  const transformed = transformBasicWebsiteAnalytics(dbAnalytics);

  await redis.set(redisKey, transformed, { ex: 86400 });

  return transformed;
};
