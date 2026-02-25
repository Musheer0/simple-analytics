import { z } from "zod";

// Reusable small schemas (don’t repeat yourself like a caveman)
const CountItemSchema = z.object({
  name: z.string().trim().min(1),
  count: z.number().int().nonnegative(),
});

const PageSchema = z.object({
  path: z.string().min(1),
  count: z.number().int().nonnegative(),
});

export const BasicWebsiteAnalyticsSchema = z.object({
  visitor_section: z.object({
    bounce_rate: z.number().min(0).max(100), 
    page_views: z.number().int().nonnegative(),
    visitor: z.number().int().nonnegative(),
  }),

  pages_section: z.array(PageSchema),

  utm: z.object({
    source: z.array(CountItemSchema),
    campaign: z.array(CountItemSchema),
  }),

  metadata: z.object({
    browser: z.record(z.string(), z.number().int().nonnegative()),
    country_code: z.record(z.string(), z.number().int().nonnegative()),
    device_type: z.record(z.string(), z.number().int().nonnegative()),
    os: z.record(z.string(), z.number().int().nonnegative()),
    referrer: z.record(z.string(), z.number().int().nonnegative()),
  }),
});