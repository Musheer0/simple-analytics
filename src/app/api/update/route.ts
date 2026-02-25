import { convertBigInts } from "@/lib/convert-obj-bignt-int";
import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { redisKeys } from "@/lib/redis-key-registry";
import { NextResponse } from "next/server";
import {BasicWebsiteAnalyticsSchemaType} from '@/features/analytics/schemas/analytics-schema'
import { TTL } from "@/constants";
const saveWebsiteAnalytics = async(websiteId:string)=>{
  if(!websiteId) return
    if (!/^[a-z0-9]+$/i.test(websiteId)) {
    return 
  }
  const [
    BOUNCE_RATE,
    VISITOR,
    UTM_SOURCE,
    UTM_CAMPAIGN,
    PATH_CHANGES,
    METADATA,
  ] = await prisma.$transaction([
    prisma.$queryRaw<[{ bounce_rate: BigInt }]>`
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
    prisma.$queryRaw<{ utm_source: string; total_sessions: BigInt }[]>`
            SELECT TRIM(utm_source) AS utm_source , COUNT(*) AS total_sessions 
            FROM "Session" WHERE website_id=${websiteId} 
            GROUP BY utm_source
            ORDER BY total_sessions DESC
            `,
    prisma.$queryRaw<{ utm_campaign: string; total_sessions: BigInt }[]>`
            SELECT TRIM(utm_campaign) AS utm_campaign , COUNT(*) AS total_sessions 
            FROM "Session" WHERE website_id=${websiteId} 
            GROUP BY utm_campaign
            ORDER BY total_sessions DESC
            `,
    prisma.$queryRaw<{ path: string; visit_count: BigInt }[]>`
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
    prisma.$queryRaw<{ type: string; value: string; count: BigInt }[]>`
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
    bounce_rate: Number(BOUNCE_RATE[0].bounce_rate),
    page_views: Number(VISITOR[0].page_views),
    visitor: Number(VISITOR[0].unique_views),
  };
  const pages_section = PATH_CHANGES.map((c) => ({
    path: c.path.split("http://")[1].split("/").slice(1).join("/"),
    count: Number(c.visit_count),
  }));
  const utm = {
    source: UTM_SOURCE.map((s) => ({
      name: s.utm_source,
      count: Number(s.total_sessions),
    })),
    campaign: UTM_CAMPAIGN.map((s) => ({
      name: s.utm_campaign,
      count: Number(s.total_sessions),
    })),
  };
  const metadata: BasicWebsiteAnalyticsSchemaType["metadata"]  = {browser:{},country_code:{},device_type:{},os:{},referrer:{}};
    METADATA.forEach((m) => {
      const type = m.type as keyof typeof metadata;
      if (!metadata[type][m.value]) {
        metadata[type][m.value] = 0;
      }
        metadata[type][m.value] += Number(m.count);
});
  const result:BasicWebsiteAnalyticsSchemaType= {
    visitor_section,
    pages_section,
    utm,
    metadata,
  }
  await redis.set(redisKeys.BASIC_WEBSITE_ANALYTICS(websiteId),result,{ex:TTL.DAY_1})
  await prisma.basicWebsiteAnalytics.update({
    where:{
      websiteId
    },
    data:{
      bounceRate:result.visitor_section.bounce_rate,
      pageHistory:result.pages_section,
      utm_campaign:result.utm.campaign,
      utm_source:result.utm.source,
      metadata:result.metadata,
      pageViews:result.visitor_section.page_views,
      visitors:result.visitor_section.visitor,
      
    }
  })
}
export const GET = async () => {
  //todo cursor based update 
  const websiteIds = await prisma.website.findMany({
    where:{
      created_at:{gt:new Date(Date.now()+1000*60*60*24*7)}
    },
    select:{
      id:true
    }
  })
  
  for (let i=0;i<websiteIds.length;i++){
    try {
      await  saveWebsiteAnalytics(websiteIds[i].id);
    } catch (error) {
      console.log(error)
    }
  }
  return NextResponse.json({
    success:true
  });
};
