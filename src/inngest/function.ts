import { redis } from "@/lib/redis";
import { inngest } from "./client";
import { redisKeys } from "@/lib/redis-key-registry";
import z from "zod";
import { createInitialAnalytics } from "@/features/analytics/lib/create-initial-analytic-state";
import prisma from "@/lib/db";
import { BasicWebsiteAnalyticsSchemaType } from "@/features/analytics/schemas/analytics-schema";
import { TTL } from "@/constants";
import { getBasicWebsiteAnalytics } from "@/features/analytics/lib/getbasic-analytics-cache";

export const helloWorld = inngest.createFunction(
  { id: "update_analytics" },
  { event: "analytics/update_analytics" },
  async ({ event, step }) => {
    const data: any = event.data;
    if (!data.type || !data.website_id) return;

    if (data.type === "NEW_VISITOR") {
      const cache = await getBasicWebsiteAnalytics(data.website_id);
      cache.visitor_section.visitor += 1;
      if (data.metadata && typeof data.metadata === "object") {
        if (data.metadata && typeof data.metadata === "object") {
          for (const key in data.metadata) {
            if (!(key in cache.metadata)) continue;
            const typedKey = key as keyof typeof cache.metadata;
            const value = String(data.metadata[typedKey]);
            cache.metadata[typedKey][value] =
              (cache.metadata[typedKey][value] ?? 0) + 1;
          }
        }
      }

      await prisma.basicWebsiteAnalytics.update({
        where: {
          websiteId: data.website_id,
        },
        data: {
          visitors: { increment: 1 },
          metadata: cache.metadata,
        },
      });
      await redis.set(
        redisKeys.BASIC_WEBSITE_ANALYTICS(data.website_id),
        cache,
        { ex: TTL.DAY_1 },
      );
    }
    if (data.type === "PAGE_VIEW") {
      const cache =
        (await redis.get<BasicWebsiteAnalyticsSchemaType>(
          redisKeys.BASIC_WEBSITE_ANALYTICS(data.website_id),
        )) || createInitialAnalytics();
      cache.visitor_section.page_views += 1;

      //handle utm
      if (data?.utm_campaign) {
        const campaign = cache.utm.campaign.find(
          (v) => v.name === data.utm_campaign,
        );
        if (campaign) {
          campaign.count += 1;
        } else {
          cache.utm.campaign.push({ name: data.utm_campaign, count: 1 });
        }
      }
      if (data?.utm_source) {
        const source = cache.utm.source.find(
          (v: any) => v.name === data.utm_campaign,
        );
        if (source) {
          source.count += 1;
        } else {
          cache.utm.source.push({ name: data.utm_campaign, count: 1 });
        }
      }
      await prisma.basicWebsiteAnalytics.update({
        where: {
          websiteId: data.website_id,
        },
        data: {
          pageViews: { increment: 1 },
          utm_campaign: cache.utm.campaign,
          utm_source: cache.utm.source,
        },
      });
      await redis.set(
        redisKeys.BASIC_WEBSITE_ANALYTICS(data.website_id),
        cache,
        { ex: TTL.DAY_1 },
      );
    }
    if (data.type === "PAGE_EXIT") {
      const cache =
        (await redis.get<BasicWebsiteAnalyticsSchemaType>(
          redisKeys.BASIC_WEBSITE_ANALYTICS(data.website_id),
        )) || createInitialAnalytics();
      if (data.pathHistory) {
        if (Array.isArray(data.pathHistory)) {
  const path_history = data.pathHistory;

  if (path_history.length === 0) {
   const bounced_session = Math.round((cache.visitor_section.page_views*cache.visitor_section.bounce_rate))+1
    cache.visitor_section.bounce_rate =bounced_session/cache.visitor_section.page_views
  }
    for (const path in path_history) {
            const existingPath = cache.pages_section.find(
              (p) => p.path == path,
            );
            if (existingPath) {
              cache.pages_section[
                cache.pages_section.indexOf(existingPath)
              ].count += 1;
            } else {
              cache.pages_section.push({ path, count: 1 });
            }
          }
}

      }

      await prisma.basicWebsiteAnalytics.update({
        where: {
          websiteId: data.website_id,
        },
        data: {
          pageHistory: cache.pages_section,
          bounceRate: cache.visitor_section.bounce_rate,
        },
      });
      await redis.set(
        redisKeys.BASIC_WEBSITE_ANALYTICS(data.website_id),
        cache,
        { ex: TTL.DAY_1 },
      );
    }
    if (data.type === "PATH_CHANGE") {
      const cache =
        (await redis.get<BasicWebsiteAnalyticsSchemaType>(
          redisKeys.BASIC_WEBSITE_ANALYTICS(data.website_id),
        )) || createInitialAnalytics();
           if (data.pathHistory) {
        if (Array.isArray(data.pathHistory)) {
  const path_history = data.pathHistory;

  if (path_history.length === 0) {
    const bounced_session = Math.round((cache.visitor_section.page_views*cache.visitor_section.bounce_rate))+1
    cache.visitor_section.bounce_rate =bounced_session/cache.visitor_section.page_views
  }
    for (const path in path_history) {
            const existingPath = cache.pages_section.find(
              (p) => p.path == path,
            );
            if (existingPath) {
              cache.pages_section[
                cache.pages_section.indexOf(existingPath)
              ].count += 1;
            } else {
              cache.pages_section.push({ path, count: 1 });
            }
          }
}

      }

      await prisma.basicWebsiteAnalytics.update({
        where: {
          websiteId: data.website_id,
        },
        data: {
          pageHistory: cache.pages_section,
          bounceRate: cache.visitor_section.bounce_rate,
        },
      });
      await redis.set(
        redisKeys.BASIC_WEBSITE_ANALYTICS(data.website_id),
        cache,
        { ex: TTL.DAY_1 },
      );
    }
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);
