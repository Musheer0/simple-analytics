import prisma from "@/lib/db"
import { DailyAnalytics } from "@/features/analytics/types"

export const generateDailyAnalyticsSnapshot = async () => {
  const data = await prisma.$queryRaw<DailyAnalytics[]>`
    WITH session_stats AS (
      SELECT
        website_id,
        session_id,
        date_trunc('day', created_at) AS day,
        COUNT(*) FILTER (
          WHERE type IN ('PATH_CHANGE', 'PAGE_EXIT', 'PAGE_VIEW')
          AND path_history = '{}'
        ) AS page_views
      FROM "Event"
      WHERE type IN ('PATH_CHANGE', 'PAGE_EXIT', 'PAGE_VIEW')
        AND created_at < CURRENT_DATE AND created_at >= NOW() - INTERVAL '2 years'
      GROUP BY website_id, session_id, day
    ),

    bounce_data AS (
      SELECT
        website_id,
        day,
        100.0 * COUNT(*) FILTER (WHERE page_views = 1)
        / NULLIF(COUNT(*), 0) AS bounce_rate
      FROM session_stats
      GROUP BY website_id, day
    ),

    session_data AS (
      SELECT 
        website_id,
        date_trunc('day', started_at) AS day,
        COUNT(*) AS total_page_views,
        COUNT(DISTINCT visitor_id) AS visitors
      FROM "Session"
      WHERE started_at < CURRENT_DATE AND started_at >= NOW() - INTERVAL '2 years'
      GROUP BY website_id, day
    )

    SELECT
      s.website_id,
      s.day,
      s.total_page_views::int,
      s.visitors::int,
      b.bounce_rate
    FROM session_data s
    LEFT JOIN bounce_data b
      ON s.website_id = b.website_id
      AND s.day = b.day
    ORDER BY s.day DESC;
  `

  if (!data.length) return

  await prisma.analyticsSnapshot.createMany({
    data: data.map((d) => ({
      websiteId: d.website_id,
      pageViews: d.total_page_views,
      visitors: d.visitors,
      bounceRate: d.bounce_rate ?? 0,
      duration: 1000 * 60 * 60 * 24, // 24 hours
      snapshot_at: new Date(d.day), // better than new Date()
    })),
    skipDuplicates:true
  });
    const oldest = data[data.length - 1] ?? null
  return oldest
}