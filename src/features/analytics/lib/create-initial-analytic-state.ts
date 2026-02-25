export const createInitialAnalytics = () => ({
  visitor_section: {
    bounce_rate: 0,
    page_views: 0,
    visitor: 0,
  },

  pages_section: [],

  utm: {
    source: [],
    campaign: [],
  },

  metadata: {
    browser: {},
    country_code: {},
    device_type: {},
    os: {},
    referrer: {},
  },
});