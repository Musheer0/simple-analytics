import { ANALYTICS_TIME, TTL } from "@/constants";
import { getWebsiteById } from "@/features/websites/actions/query";
import { Visitor } from "@/generated/prisma/client";
import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { redisKeys } from "@/lib/redis-key-registry";
import { auth } from "@clerk/nextjs/server";
import { AnalyticsSummary, PageHistory, TrafficMetadata, UtmMetadata, WebsiteAnalytics } from "../types";
import { bigintToNumberJSON } from "@/lib/convert-bignt-to-num-json";

export const getVisitor = async (
  websiteId: string,
  visitorId: string,
): Promise<Visitor | null> => {
  const cache = await redis.get<Visitor>(
    redisKeys.PIXEL_VISITOR_KEY(websiteId, visitorId),
  );
  if (cache) return cache;
  const visitor = await prisma.visitor.findFirst({
    where: {
      website_id: websiteId,
      id: visitorId,
    },
  });
  return visitor;
};

export const getBasicWebsiteAnalytics =async(data:{websiteId:string,duration: keyof typeof ANALYTICS_TIME,includeWebsite?:boolean})=>{
  
  if(!data.websiteId || !data.duration) throw new Error("invalid data");
  
  const {orgId} = await auth();
  
  const website = await getWebsiteById(data.websiteId);
  if(!website) throw new Error("Website not found");
  if(website.org_id!==orgId) throw new Error("Forbidden");
  
  const duration = ANALYTICS_TIME[data.duration]
  if(!duration) throw new Error("duration not supported");
  const cache_key = redisKeys[`BASIC_WEBSITE_ANALYTICS_${data.duration}`](website.id)
  const cache = await redis.get<WebsiteAnalytics>(cache_key);
  if(cache) return data.includeWebsite ?{website,...cache} :cache;

  const s = Date.now()
  //page_visitor_section
  const[ page_visitor_data] = await prisma.$queryRaw<AnalyticsSummary[]>`
  WITH session_stats AS (
  SELECT 
    session_id,
    COUNT(*) AS event_count
  FROM "Event"
  WHERE website_id=${website.id}  
  AND type IN ('PATH_CHANGE', 'PAGE_EXIT','PAGE_VIEW')
  AND path_history != '{}'
  AND created_at >= NOW() -  ${duration}::interval

  GROUP BY session_id
),
session_data AS (
  SELECT COUNT(*) as page_views, 
         COUNT(DISTINCT visitor_id) as unique_views  
  FROM "Session" 
  WHERE website_id=${website.id}
      AND started_at >= NOW() -  ${duration}::interval

)
SELECT 
 COALESCE( 100.0 * COUNT(*) FILTER (WHERE event_count <= 1) /NULLIF(COUNT(*), 0) ,0)AS bounce_rate,
  MAX(page_views) AS page_views,
  MAX(unique_views) AS unique_views
   FROM session_stats, session_data;  `;
  
  const [utm] = await prisma.$queryRaw<UtmMetadata[]>`
  WITH source_data AS (
  SELECT 
    COALESCE(utm_source, 'direct') AS key,
    COUNT(*) AS count
  FROM "Session"
  WHERE 
    started_at >= NOW() -  ${duration}::interval
    AND website_id = ${website.id}
    AND utm_source != ''
  GROUP BY key
),
campaign_data AS (
  SELECT 
    COALESCE(utm_campaign, 'unknown') AS key,
    COUNT(*) AS count
  FROM "Session"
  WHERE 
    started_at >= NOW() -  ${duration}::interval
    AND website_id = ${website.id}
  AND utm_campaign != ''
  GROUP BY key
)
SELECT 
  (SELECT jsonb_object_agg(key, count) FROM source_data) AS utm_source,
  (SELECT jsonb_object_agg(key, count) FROM campaign_data) AS utm_campaign;
  `;

  const[ metadata] = await prisma.$queryRaw<TrafficMetadata[]>`
  WITH country_data AS (
  SELECT country_code AS key, COUNT(*) AS count
  FROM "Visitor"
  WHERE 
    website_id = ${website.id}
    AND created_at >= NOW() -  ${duration}::interval
  GROUP BY country_code
),
device_data AS (
  SELECT device_type AS key, COUNT(*) AS count
  FROM "Visitor"
  WHERE 
    website_id = ${website.id}
    AND created_at >= NOW() -  ${duration}::interval
  GROUP BY device_type
),
os_data AS (
  SELECT os AS key, COUNT(*) AS count
  FROM "Visitor"
  WHERE 
    website_id = ${website.id}
    AND created_at >= NOW() -  ${duration}::interval
  GROUP BY os
),
browser_data AS (
  SELECT browser AS key, COUNT(*) AS count
  FROM "Visitor"
  WHERE 
    website_id = ${website.id}
    AND created_at >= NOW() -  ${duration}::interval
  GROUP BY browser
)
SELECT 
  COALESCE((SELECT jsonb_object_agg(key, count) FROM country_data), '{}'::jsonb) AS countries,
  COALESCE((SELECT jsonb_object_agg(key, count) FROM device_data), '{}'::jsonb) AS devices,
  COALESCE((SELECT jsonb_object_agg(key, count) FROM os_data), '{}'::jsonb) AS operating_systems,
  COALESCE((SELECT jsonb_object_agg(key, count) FROM browser_data), '{}'::jsonb) AS browsers;
  `;

  const page_history = await prisma.$queryRaw<PageHistory>`
  SELECT UNNEST(path_history) as page, count (*) as visits 
FROM  "Event"
  WHERE website_id =${website.id}
    AND type IN ('PATH_CHANGE','PAGE_EXIT','PAGE_VIEW')
    AND path_history IS NOT NULL
        AND created_at >= NOW() -  ${duration}::interval

GROUP BY page
ORDER BY visits DESC ;
  `;
  const [avg] = await prisma.$queryRaw<{avg_time:number}[]>`
  select avg(active_time)/1000 as avg_time from "Event" where type ='PAGE_EXIT' 
  and website_id=${website.id}
  AND created_at >= NOW() -  ${duration}::interval

  `
  const e = Date.now()
  console.log((e-s)/1000+"secs")
  const result:WebsiteAnalytics = {
    bounce_rate:page_visitor_data.bounce_rate,
    page_views:page_visitor_data.page_views,
    unique_views:page_visitor_data.unique_views,
    browsers:metadata.browsers,
    countries:metadata.countries,
    devices:metadata.devices,
    operating_systems:metadata.operating_systems,
    pages:page_history,
    utm_campaign:utm.utm_campaign,
    utm_source:utm.utm_source,
    avg_session:avg.avg_time
  };
  
  const parsed_result = bigintToNumberJSON<WebsiteAnalytics>(result)
  await redis.set(cache_key, {...parsed_result,duration:data.duration,cached_at:new Date()},{ex:TTL.HOUR_1});
  return data.includeWebsite ? {...parsed_result, duration:data.duration,website}:{...parsed_result, duration:data.duration}
}