import prisma from "@/lib/db";
import { AnalyticsSummary, PageHistory, TrafficMetadata, UtmMetadata, WebsiteAnalytics } from "../../types";

export const getTrafficMetadata = async (
  websiteId: string,
  duration: string
): Promise<TrafficMetadata> => {
  const [data] = await prisma.$queryRaw<TrafficMetadata[]>`
  WITH country_data AS (
    SELECT country_code AS key, COUNT(*) AS count
    FROM "Visitor"
    WHERE website_id=${websiteId}
      AND created_at >= NOW() - ${duration}::interval
    GROUP BY country_code
  ),
  device_data AS (
    SELECT device_type AS key, COUNT(*) AS count
    FROM "Visitor"
    WHERE website_id=${websiteId}
      AND created_at >= NOW() - ${duration}::interval
    GROUP BY device_type
  ),
  os_data AS (
    SELECT os AS key, COUNT(*) AS count
    FROM "Visitor"
    WHERE website_id=${websiteId}
      AND created_at >= NOW() - ${duration}::interval
    GROUP BY os
  ),
  browser_data AS (
    SELECT browser AS key, COUNT(*) AS count
    FROM "Visitor"
    WHERE website_id=${websiteId}
      AND created_at >= NOW() - ${duration}::interval
    GROUP BY browser
  )
  SELECT
    COALESCE((SELECT jsonb_object_agg(key,count) FROM country_data),'{}'::jsonb) AS countries,
    COALESCE((SELECT jsonb_object_agg(key,count) FROM device_data),'{}'::jsonb) AS devices,
    COALESCE((SELECT jsonb_object_agg(key,count) FROM os_data),'{}'::jsonb) AS operating_systems,
    COALESCE((SELECT jsonb_object_agg(key,count) FROM browser_data),'{}'::jsonb) AS browsers;
  `;

  return data;
};