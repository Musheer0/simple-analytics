import prisma from "@/lib/db";
import {
  AnalyticsSummary,
  PageHistory,
  TrafficMetadata,
  UtmMetadata,
  WebsiteAnalytics,
} from "../../types";
export const getAverageSessionTime = async (
  websiteId: string,
  duration: string,
): Promise<number> => {
  const [data] = await prisma.$queryRaw<{ avg_time: number }[]>`
    SELECT AVG(active_time)/1000 AS avg_time
    FROM "Event"
    WHERE website_id=${websiteId}
      AND type='PAGE_EXIT'
      AND created_at >= NOW() - ${duration}::interval
  `;

  return data?.avg_time ?? 0;
};
