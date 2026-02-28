import prisma from "@/lib/db";
import {
  AnalyticsSummary,
  PageHistory,
  TrafficMetadata,
  UtmMetadata,
  WebsiteAnalytics,
} from "../../types";

export const getPageHistory = async (
  websiteId: string,
  duration: string,
): Promise<PageHistory> => {
  return prisma.$queryRaw<PageHistory>`
  SELECT UNNEST(path_history) AS page,
         COUNT(*) AS visits
  FROM "Event"
  WHERE website_id=${websiteId}
    AND type IN ('PATH_CHANGE','PAGE_EXIT','PAGE_VIEW')
    AND path_history IS NOT NULL
    AND created_at >= NOW() - ${duration}::interval
  GROUP BY page
  ORDER BY visits DESC;
  `;
};
