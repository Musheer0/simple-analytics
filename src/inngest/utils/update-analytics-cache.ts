import { ANALYTICS_TIME, ANALYTICS_TIME_MS } from "@/constants";
import { WebsiteAnalytics } from "@/features/analytics/types";
import { redis } from "@/lib/redis";
import { redisKeys } from "@/lib/redis-key-registry";

function updateStringNumberRecord(
  key: string,
  cache: Record<string, number>,
  new_value: Record<string, number>,
) {
  var cache_pages = { ...cache };
  for (const p of Object.keys(new_value)) {
    if (cache_pages[p]) {
      cache_pages[p] += 1;
    } else {
      cache_pages = { ...cache_pages, [p]: 1 };
    }
  }
  return cache_pages;
}
export const update_analytic_cache_by_time = async (
  data: Partial<WebsiteAnalytics>,
  key: keyof typeof ANALYTICS_TIME,
  website_id: string,
) => {
  const cache_key = redisKeys[`BASIC_WEBSITE_ANALYTICS_${key}`](website_id);
  const cache = await redis.get<WebsiteAnalytics>(cache_key);
  if (!cache || !cache.duration || !cache.cached_at) return;
  const cache_duration_ms = ANALYTICS_TIME_MS[key];
  if (!cache_duration_ms) return;
  const elapsed = Date.now() - new Date(cache.cached_at).getTime();
  const remaining_time = Math.max(
    Math.floor((cache_duration_ms - elapsed) / 1000),
    0,
  );
  const updated_cache = { ...cache };
  if (data.page_views) updated_cache.page_views += 1;
  if (data.unique_views) updated_cache.unique_views += 1;
  if (data.pages && data.pages.length > 0) {
    const cache_pages = updated_cache.pages;
    for (const p of data.pages) {
      if (cache_pages[p.page as any]) {
        cache_pages[p.page as any].visits += 1;
      } else {
        cache_pages[p.page as any] = { page: p.page, visits: 1 };
      }
    }
    updated_cache.pages = cache_pages;
  }
  if (data.browsers) {
    const cache_browsers = updateStringNumberRecord(
      "browsers",
      updated_cache.browsers,
      data.browsers,
    );
    updated_cache.browsers = cache_browsers;
  }

  if (data.countries) {
    const cache_countries = updateStringNumberRecord(
      "countries",
      updated_cache.countries,
      data.countries,
    );
    updated_cache.countries = cache_countries;
  }

  if (data.devices) {
    const cache_devices = updateStringNumberRecord(
      "devices",
      updated_cache.devices,
      data.devices,
    );
    updated_cache.devices = cache_devices;
  }

  if (data.operating_systems) {
    const cache_os = updateStringNumberRecord(
      "operating_systems",
      updated_cache.operating_systems,
      data.operating_systems,
    );
    updated_cache.operating_systems = cache_os;
  }
  if (data.pages && data.pages.length === 0) {
    const totalPageViews = Number(updated_cache.page_views) ?? 0;
    if (totalPageViews <= 0) return;
    const oldPageViews = totalPageViews - 1; // exclude current session
    const oldBounceRate = updated_cache.bounce_rate ?? 0;
    // Convert old % → old bounce count
    const oldBounceCount =
      oldPageViews > 0 ? (oldBounceRate / 100) * oldPageViews : 0;
    const newBounceCount = oldBounceCount + 1;
    const newBounceRate =
      totalPageViews === 0 ? 0 : (newBounceCount / totalPageViews) * 100;
    updated_cache.bounce_rate = Number(newBounceRate.toFixed(2));
  }
  await redis.set(cache_key, updated_cache, { ex: remaining_time });
};

export const update_analytics_cache = async (
  data: Partial<WebsiteAnalytics>,
  website_id: string,
) => {
  const keys = Object.keys(ANALYTICS_TIME);
  for (const k of keys) {
    try {
      await update_analytic_cache_by_time(
        data,
        k as keyof typeof ANALYTICS_TIME,
        website_id,
      );
    } catch (error) {
      console.error(error);
    }
  }
  return;
};
