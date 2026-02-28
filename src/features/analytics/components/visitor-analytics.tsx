import React from "react";
import { StatCard } from "./start-card";
import { Eye, MousePointer, TrendingUp, Users } from "lucide-react";
import { TrendPoint, WebsiteAnalytics } from "../types";

const VisitorAnalytics = ({
  data,
  trend,
}: {
  data: WebsiteAnalytics;
  trend: TrendPoint;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Page Views"
        value={data.page_views || 0}
        icon={<Eye className="h-5 w-5" />}
        trend={{
          value: (trend.visits || 0) / data.page_views,
          isPositive: data.page_views - (trend.visits || 0) > 0 ? true : false,
        }}
      />
      <StatCard
        label="Unique Visitors"
        value={data.unique_views || 0}
        icon={<Users className=" w-5" />}
        trend={{
          value: (trend.visitors || 0) / data.unique_views,
          isPositive:
            data.unique_views - (trend.visitors || 0) > 0 ? true : false,
        }}
      />
      <StatCard
        label="Bounce Rate"
        value={`${Number(data.bounce_rate).toFixed(2)}%`}
        icon={<TrendingUp className="h-5 w-5" />}
        isBounce
        trend={{
          value: data.bounce_rate - (trend.bounce_rate || 0),
          isPositive:
            data.bounce_rate - (trend.bounce_rate || 0) > 0 ? false : true,
        }}
      />
      <StatCard
        label="Avg. Session"
        value={`${Number(data.avg_session || 0).toFixed(1)} secs`}
        icon={<MousePointer className="h-5 w-5" />}
      />
    </div>
  );
};

export default VisitorAnalytics;
