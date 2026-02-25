import { BasicWebsiteAnalytics } from "@/generated/prisma/client";
import { BasicWebsiteAnalyticsSchemaType } from "../schemas/analytics-schema";

const parseUTM = (value: unknown): { name: string; count: number }[] => {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is { name: string; count: number } =>
      typeof item === "object" &&
      item !== null &&
      "name" in item &&
      "count" in item &&
      typeof (item as any).name === "string" &&
      typeof (item as any).count === "number",
  );
};

const parseMetadata = (value: unknown) => {
  if (typeof value !== "object" || value === null) {
    return {
      browser: {},
      country_code: {},
      device_type: {},
      os: {},
      referrer: {},
    };
  }

  const meta = value as Record<string, unknown>;

  return {
    browser: (meta.browser as Record<string, number>) ?? {},
    country_code: (meta.country_code as Record<string, number>) ?? {},
    device_type: (meta.device_type as Record<string, number>) ?? {},
    os: (meta.os as Record<string, number>) ?? {},
    referrer: (meta.referrer as Record<string, number>) ?? {},
  };
};

export const transformBasicWebsiteAnalytics = (
  dbAnalytics: BasicWebsiteAnalytics,
): BasicWebsiteAnalyticsSchemaType => {
  return {
    visitor_section: {
      bounce_rate: dbAnalytics.bounceRate ?? 0,
      page_views: dbAnalytics.pageViews ?? 0,
      visitor: dbAnalytics.visitors ?? 0,
    },

    pages_section: [],

    utm: {
      source: parseUTM(dbAnalytics.utm_source),
      campaign: parseUTM(dbAnalytics.utm_campaign),
    },

    metadata: parseMetadata(dbAnalytics.metadata),
  };
};
