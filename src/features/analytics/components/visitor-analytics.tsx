import React from 'react'
import { StatCard } from './start-card'
import { Eye, MousePointer, TrendingUp, Users } from 'lucide-react'
import { WebsiteAnalytics } from '../types'

const VisitorAnalytics = ({data}:{data:WebsiteAnalytics}) => {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Page Views"
          value={data.page_views||0}
          icon={<Eye className="h-5 w-5" />}
          trend={{ value:0, isPositive: true }}
        />
        <StatCard
          label="Unique Visitors"
          value={data.unique_views||0}
          icon={<Users className=" w-5" />}
          trend={{ value:0, isPositive: true }}
        />
        <StatCard
          label="Bounce Rate"
          value={`${Number(data.bounce_rate).toFixed(2)}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value:0, isPositive: true }}
        />
        <StatCard
          label="Avg. Session"
          value={`${Number(data.avg_session ||0).toFixed(1)} secs`}
          icon={<MousePointer className="h-5 w-5" />}
          trend={{ value:0, isPositive: true }}
        />
      </div>
      
  )
}

export default VisitorAnalytics
