import { ANALYTICS_TIME } from "@/constants";
import { getBasicWebsiteAnalytics } from "@/features/analytics/actions/query";
import AnalyticsWebsiteCard from "@/features/analytics/components/analytics-website-card";
import OtherAnalytics from "@/features/analytics/components/other-analytics";
import VisitorAnalytics from "@/features/analytics/components/visitor-analytics";
import React from "react";

const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ range: keyof typeof ANALYTICS_TIME }>;
}) => {
  const { id } = await params;
  const { range } = await searchParams;
  const analytics = await getBasicWebsiteAnalytics({
    websiteId: id,
    duration: range || "ONE_WEEK",
    includeWebsite: true,
  });
  if (analytics && "website" in analytics)
    return (
      <div className="flex-1 max-w-6xl space-y-5 mx-auto w-full h-full h-min-screen p-4">
        <AnalyticsWebsiteCard website={analytics.website} />
        <VisitorAnalytics data={analytics} trend={analytics.trend} />
        <OtherAnalytics data={analytics} />
      </div>
    );
};

export default page;
