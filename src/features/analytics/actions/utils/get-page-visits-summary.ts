import prisma from "@/lib/db";
import { AnalyticsSummary, } from "../../types";

export const getPageVisitorSummary = async (
  websiteId: string,
  duration: string
): Promise<AnalyticsSummary> => {
  const [data] = await prisma.$queryRaw<AnalyticsSummary[]>`
  WITH session_stats AS (
    SELECT session_id, COUNT(*) AS event_count
    FROM "Event"
    WHERE website_id=${websiteId}
      AND type IN ('PATH_CHANGE','PAGE_EXIT','PAGE_VIEW')
      AND path_history != '{}'
      AND created_at >= NOW() - ${duration}::interval
    GROUP BY session_id
  ),
  session_data AS (
    SELECT COUNT(*) as page_views,
           COUNT(DISTINCT visitor_id) as unique_views
    FROM "Session"
    WHERE website_id=${websiteId}
      AND started_at >= NOW() - ${duration}::interval
  )
  SELECT 
    COALESCE(
      100.0 * COUNT(*) FILTER (WHERE event_count <= 1)
      / NULLIF(COUNT(*), 0),
    0) AS bounce_rate,
    MAX(page_views) AS page_views,
    MAX(unique_views) AS unique_views
  FROM session_stats, session_data;
  `;

  return data;
};