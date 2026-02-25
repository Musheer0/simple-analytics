import { convertBigInts } from "@/lib/convert-obj-bignt-int";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
export const GET = async () => {
  const websiteId = "cmm1qcnxi0003i1k4s729ggqz";
  if (!/^[a-z0-9]+$/i.test(websiteId)) {
    return NextResponse.json({ error: "Invalid website id" }, { status: 400 });
  }
    const [
        BOUNCE_RATE,
        VISITOR,
        UTM_SOURCE,
        UTM_CAMPAIGN,
        PATH_CHANGES,
        METADATA,
    ] = await prisma.$transaction([
        prisma.$queryRaw<[{ bounce_rate: BigInt}]>`
            WITH session_stats AS (
                SELECT session_id, COUNT(*) AS event_count 
                FROM "Event" 
                WHERE type IN ('PATH_CHANGE', 'PAGE_EXIT') AND website_id = ${websiteId}
                GROUP BY session_id
            )
            SELECT 100.0*COUNT(*) FILTER(WHERE event_count<=1) /COUNT (*) AS bounce_rate FROM session_stats
            `,
        prisma.$queryRaw<[{ page_views: BigInt; unique_views: BigInt }]>`
            SELECT COUNT(*) AS page_views ,COUNT(DISTINCT visitor_id) AS unique_views FROM "Session" WHERE website_id=${websiteId}
            `,
        prisma.$queryRaw<{utm_source:string,total_sessions:BigInt}[]>`
            SELECT TRIM(utm_source) AS utm_source , COUNT(*) AS total_sessions 
            FROM "Session" WHERE website_id=${websiteId} 
            GROUP BY utm_source
            ORDER BY total_sessions DESC
            `,
        prisma.$queryRaw<{utm_campaign:string,total_sessions:BigInt}[]>`
            SELECT TRIM(utm_campaign) AS utm_campaign , COUNT(*) AS total_sessions 
            FROM "Session" WHERE website_id=${websiteId} 
            GROUP BY utm_campaign
            ORDER BY total_sessions DESC
            `,
        prisma.$queryRaw<{path: string,visit_count: BigInt}[]>`
            SELECT path , COUNT(*) AS visit_count 
            FROM (
            SELECT UNNEST(path_history) as path
            FROM "Event" 
            WHERE website_id=${websiteId} AND
            type IN ('PATH_CHANGE', 'PAGE_EXIT') AND
            path_history != '{}'
            ) as paths GROUP BY path
            `,

            //ai written 
        prisma.$queryRaw<  { type: string, value: string, count: BigInt }[]>`
            SELECT
                CASE
                WHEN GROUPING(referrer) = 0 THEN 'referrer'
                WHEN GROUPING(browser) = 0 THEN 'browser'
                WHEN GROUPING(os) = 0 THEN 'os'
                WHEN GROUPING(country_code) = 0 THEN 'country_code'
                WHEN GROUPING(device_type) = 0 THEN 'device_type'
                END AS type,

            COALESCE(referrer, browser, os, country_code, device_type) AS value,

            COUNT(*) AS count

            FROM "Visitor"
            WHERE website_id = ${websiteId}

            GROUP BY GROUPING SETS (
            (referrer),
            (browser),
            (os),
            (country_code),
            (device_type)
            )
            ORDER BY type, count DESC;`,
        ]);

const visitor_section = {
 bounce_rate:Number(BOUNCE_RATE[0].bounce_rate),
 page_views:Number(VISITOR[0].page_views),
 visitor:Number(VISITOR[0].unique_views)
}
const pages_section= PATH_CHANGES.map((c)=>({path:c.path.split("http://")[1].split('/').slice(1).join('/'),count:Number(c.visit_count)}))
const utm = {
  source:UTM_SOURCE.map((s)=>({name:s.utm_source,count:Number(s.total_sessions)})),
  campaign:UTM_CAMPAIGN.map((s)=>({name:s.utm_campaign,count:Number(s.total_sessions)})),
}
const metadata:Record<any ,any> = {}
METADATA.forEach((m) => {
  if (!metadata[m.type]) {
    metadata[m.type] = {}
  }

  if (!metadata[m.type][m.value]) {
    metadata[m.type][m.value] = 0
  }

  metadata[m.type][m.value] += Number(m.count)
})

  return NextResponse.json({
    visitor_section,
    pages_section,
    utm,
    metadata
  });
};
