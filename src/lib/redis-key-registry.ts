export const redisKeys = {
  WEBSITE_KEY_BY_ORG: (websiteId: string, orgId: string) =>
    `website:${websiteId}:by_orgId:${orgId}`,
  WEBSITE_PAGINATED_KEY: (orgId: string, page: number, oldest: number) =>
    `website:org:${orgId}:cursor:${oldest}:page:${page}`,
  WEBSITE_PAGINATED_KEY_WITHOUT_OLDEST: (orgId: string, page: number) =>
    `website:org:${orgId}:cursor:*:page:${page}`,
  WEBSITE_KEY_BY_ID: (websiteId: string) => `website:${websiteId}`,
  PIXEL_VISITOR_KEY: (websiteId: string, visitorId: string) =>
    `pixel:website:${websiteId}:visitor:${visitorId}`,
  PIXEL_VISITOR_SESSION_KEY: (session: string) => `pixel:session:${session}`,
};
