import { ANALYTICS_TIME } from "@/constants";

export type VisitorSessionCache = {
  visitor: string;
  session_id: string;
  last_heartbeat: Date;
  blur: {
    started: Date;
    ended: Date;
  };
};

export type AnalyticsSummary = {
  bounce_rate: number;
  page_views: number;
  unique_views: number;
};
export type UtmMetadata = {
  utm_source: Record<string, number>;
  utm_campaign: Record<string, number>;
};
export type TrafficMetadata = {
  countries: Record<string, number>;
  devices: Record<string, number>;
  operating_systems: Record<string, number>;
  browsers: Record<string, number>;
};
export type PageHistory = {page:string ,visits:number}[]
export type WebsiteAnalytics = {
  bounce_rate: number;
  page_views: number;
  unique_views: number;

  utm_source: Record<string, number>;
  utm_campaign: Record<string, number>;

  countries: Record<string, number>;
  devices: Record<string, number>;
  operating_systems: Record<string, number>;
  browsers: Record<string, number>;
  pages:PageHistory,
  duration?:keyof typeof ANALYTICS_TIME,
  cached_at?:Date
};

export type inngest_update_cache = {
  type:"NEW_VISITOR"|"PAGE_VIEW"|"PATH_CHANGE"|"PAGE_EXIT",
  website_id:string
  metadata?: {
        browser:string,
        os:string,
        device_type:string,
        country_code:string,
      },
  page_view?:{
    utm_campaign:string,
    utm_source:string
  },
  path_changes?:string[]
}