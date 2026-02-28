import prisma from "@/lib/db";
import { HourlyAnalytics } from "../types";

export const generateHourlyAnalyticsSnapshot = async () => {
  const data = await prisma.$queryRaw<HourlyAnalytics[]>`
    WITH session_stats AS (
      SELECT
        website_id,
        session_id,
        date_trunc('hour', created_at) AS hour,
        COUNT(*) FILTER (
          WHERE type IN ('PATH_CHANGE', 'PAGE_EXIT', 'PAGE_VIEW')
          AND path_history = '{}'
        ) AS page_views
      FROM "Event"
      WHERE type IN ('PATH_CHANGE', 'PAGE_EXIT', 'PAGE_VIEW')
        AND created_at >= NOW() - INTERVAL '7 days'
      GROUP BY website_id, session_id, hour
    ),

    bounce_data AS (
      SELECT
        website_id,
        hour,
        100.0 * COUNT(*) FILTER (WHERE page_views = 1)
        / NULLIF(COUNT(*), 0) AS bounce_rate
      FROM session_stats
      GROUP BY website_id, hour
    ),

    session_data AS (
      SELECT 
        website_id,
        date_trunc('hour', started_at) AS hour,
        COUNT(*) AS total_page_views,
        COUNT(DISTINCT visitor_id) AS visitors
      FROM "Session"
      WHERE started_at >= NOW() - INTERVAL '7 days'
      GROUP BY website_id, hour
    )

    SELECT
      s.website_id,
      s.hour,
      s.total_page_views::int,
      s.visitors::int,
      COALESCE(b.bounce_rate, 0) AS bounce_rate
    FROM session_data s
    LEFT JOIN bounce_data b
      ON s.website_id = b.website_id
      AND s.hour = b.hour
    ORDER BY s.hour DESC;
  `;

  if (!data.length) return;

  await prisma.analyticsSnapshot.createMany({
    data: data.map((d) => ({
      websiteId: d.website_id,
      pageViews: d.total_page_views,
      visitors: d.visitors,
      bounceRate: d.bounce_rate || 0,
      duration: 1000 * 60 * 60, // 1 hour
      snapshot_at: d.hour,
    })),
    skipDuplicates: true,
  });
  const oldest = data[data.length - 1] ?? null;
  return oldest;
};
