import { redis } from "@/lib/redis";
import { inngest } from "./client";
import { inngest_update_cache } from "@/features/analytics/types";
import { update_analytics_cache } from "./utils/update-analytics-cache";
export const helloWorld = inngest.createFunction(
  { id: "update_analytics" },
  { event: "analytics/update_analytics" },
  async ({ event, step }) => {
    const data: inngest_update_cache = event.data;
    if (!data.type || !data.website_id) return;

    if (data.type == "NEW_VISITOR" && data.metadata) {
      //update unique visitor and page metadata  in cache
      await update_analytics_cache(
        {
          browsers: {
            [data.metadata.browser]: 1,
          },
          unique_views: 1,
          devices: {
            [data.metadata.device_type]: 1,
          },
          operating_systems: {
            [data.metadata.os]: 1,
          },
          countries: {
            [data.metadata.country_code]: 1,
          },
        },
        data.website_id,
      );
    }

    if (data.type == "PAGE_VIEW" && data.page_view) {
      //update page views utm in cache
      const utm =
        data.page_view.utm_campaign && data.page_view.utm_source
          ? {
              utm_campaign: {
                [data.page_view.utm_campaign]: 1,
              },
              utm_source: {
                [data.page_view.utm_source]: 1,
              },
            }
          : data.page_view.utm_campaign
            ? {
                utm_campaign: {
                  [data.page_view.utm_campaign]: 1,
                },
              }
            : data.page_view.utm_source
              ? {
                  utm_source: {
                    [data.page_view.utm_source]: 1,
                  },
                }
              : {};
      await update_analytics_cache(
        {
          ...utm,
          page_views: 1,
        },
        data.website_id,
      );
    }
    if (
      data.type === "PAGE_EXIT" ||
      (data.type === "PATH_CHANGE" && data.path_changes)
    ) {
      const page_history = (data.path_changes || []).map((e) => ({
        page: e,
        visits: 1,
      }));
      await update_analytics_cache(
        {
          pages: page_history,
        },
        data.website_id,
      );
    }
  },
);
