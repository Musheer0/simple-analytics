import { ANALYTICS_TIME, ANALYTICS_TIME_MS } from "@/constants";
import { WebsiteAnalytics } from "@/features/analytics/types";
import { redis } from "@/lib/redis";
import { redisKeys } from "@/lib/redis-key-registry";

function deepMergeNumbers(target: any, source: any) {
  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = target[key];

    // If number → add
    if (typeof sourceValue === "number") {
      if (typeof targetValue !== "number") {
        target[key] = 0;
      }
      target[key] += Number(sourceValue);
    }

    // If object → recurse
    else if (
      typeof sourceValue === "object" &&
      sourceValue !== null &&
      !Array.isArray(sourceValue)
    ) {
      if (typeof targetValue !== "object" || targetValue === null) {
        target[key] = {};
      }

      deepMergeNumbers(target[key], sourceValue);
    }
  }
}

export const update_analytic_cache_by_time = async (
  data: Partial<WebsiteAnalytics>,
  key: keyof typeof ANALYTICS_TIME,
  website_id:string
) => {
  const cache_key = redisKeys[`BASIC_WEBSITE_ANALYTICS_${key}`](website_id);
  const cache = await redis.get<WebsiteAnalytics>(cache_key);
  if (!cache || !cache.duration || !cache.cached_at) return;
  const cache_duration_ms = ANALYTICS_TIME_MS[key];
  if (!cache_duration_ms) return;
  const elapsed = Date.now() - new Date(cache.cached_at).getTime();
  const remaining_time = Math.max(
    Math.floor((cache_duration_ms - elapsed) / 1000),
    0
  );
  const updated_cache = { ...cache };
  if(data.page_views) updated_cache.page_views+=1
  else if (data.unique_views)  updated_cache.unique_views+=1
  else{
      deepMergeNumbers(updated_cache, data);  
    }
    
    if(data.pages && data.pages.length===0){
  const totalPageViews = Number(updated_cache.page_views) ?? 0;
  if (totalPageViews <= 0) return;
  const oldPageViews = totalPageViews - 1; // exclude current session
  const oldBounceRate = updated_cache.bounce_rate ?? 0;
  // Convert old % → old bounce count
  const oldBounceCount =
    oldPageViews > 0
      ? (oldBounceRate / 100) * oldPageViews
      : 0;
  const newBounceCount = oldBounceCount + 1;
  const newBounceRate =
    totalPageViews === 0
      ? 0
      : (newBounceCount / totalPageViews) * 100;
      updated_cache.bounce_rate = Number(newBounceRate.toFixed(2));
    }
  await redis.set(cache_key, updated_cache, { ex: remaining_time });
};

export const update_analytics_cache = async(data:Partial<WebsiteAnalytics>,website_id:string)=>{
    const keys = Object.keys(ANALYTICS_TIME);
    for (const k of keys){
        try {
            await update_analytic_cache_by_time(data,k as keyof typeof ANALYTICS_TIME,website_id)
        } catch (error) {
            console.error(error)
        }
    }
    return
}