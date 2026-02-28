import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  },
  isBounce?:boolean
}

export function StatCard({ label, value, icon, trend ,isBounce}: StatCardProps) {
  console.log(trend)
  return (
    <Card className="border-border bg-card hover:bg-card/80 transition-colors">
      <CardContent className="">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            {trend && (
             <>
             {isBounce
             ?
              <p className={`text-xs mt-2 ${trend.isPositive  ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ?  '↓':'↑' } {Number(trend.value).toFixed(2)}%
              </p>
             :
              <p className={`text-xs mt-2  ${trend.isPositive  ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive  ? '↑':'↓' } {Number(trend.value).toFixed(2)}%
              </p>
             
             }
             </>
            )}
          </div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
