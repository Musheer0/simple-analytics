import prisma from "@/lib/db";

export const deleteAnalyticsSnapshotsUpTo = async (
  date: Date,
  duration?: number, // optional: hourly or daily filter
) => {
  const where: any = {
    snapshot_at: {
      lte: date,
    },
  };

  if (duration) {
    where.duration = duration;
  }

  const result = await prisma.analyticsSnapshot.deleteMany({
    where,
  });

  return result.count;
};
