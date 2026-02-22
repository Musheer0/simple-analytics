export const redisKeys = {
    WEBSITE_KEY_BY_ORG:(websiteId:string, orgId:string)=>`website:${websiteId}:by_orgId:${orgId}`
}