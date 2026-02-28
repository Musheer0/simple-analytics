import prisma from "@/lib/db";
import { AnalyticsSummary, PageHistory, TrafficMetadata, UtmMetadata, WebsiteAnalytics } from "../../types";

export const getUtmMetadata = async (
  websiteId: string,
  duration: string
): Promise<UtmMetadata> => {
  const [data] = await prisma.$queryRaw<UtmMetadata[]>`
  WITH source_data AS (
    SELECT COALESCE(utm_source,'direct') AS key, COUNT(*) AS count
    FROM "Session"
    WHERE website_id=${websiteId}
      AND started_at >= NOW() - ${duration}::interval
      AND utm_source != ''
    GROUP BY key
  ),
  campaign_data AS (
    SELECT COALESCE(utm_campaign,'unknown') AS key, COUNT(*) AS count
    FROM "Session"
    WHERE website_id=${websiteId}
      AND started_at >= NOW() - ${duration}::interval
      AND utm_campaign != ''
    GROUP BY key
  )
  SELECT
    (SELECT jsonb_object_agg(key,count) FROM source_data) AS utm_source,
    (SELECT jsonb_object_agg(key,count) FROM campaign_data) AS utm_campaign;
  `;

  return data;
};