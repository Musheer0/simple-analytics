import { deleteAnalyticsSnapshotsUpTo } from "@/features/analytics/lib/delete-snapshot-upto"
import { generateDailyAnalyticsSnapshot } from "@/features/analytics/lib/generate-daily-analytics"
import { generateHourlyAnalyticsSnapshot } from "@/features/analytics/lib/generate-hourly-analytics"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req:NextRequest) => {
    if (req.method !== "GET") {
  return new NextResponse("Method Not Allowed", { status: 405 })
}
  const authHeader = req.headers.get("authorization")

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const daily = await generateDailyAnalyticsSnapshot()

  if (daily) {
    await deleteAnalyticsSnapshotsUpTo(
      new Date(daily.day.getTime()),
      1000 * 60 * 60 * 24
    )
  }

  const hourly = await generateHourlyAnalyticsSnapshot()

  if (hourly) {
    await deleteAnalyticsSnapshotsUpTo(
      new Date(hourly.hour.getTime()),
      1000 * 60 * 60
    )
  }

  return NextResponse.json({ success: true })
}