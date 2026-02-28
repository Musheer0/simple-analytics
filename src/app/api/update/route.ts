import prisma from "@/lib/db";
import { NextResponse } from "next/server";

const DELETE_LIMIT = 500;
const TWO_YEARS_IN_MS = 1000 * 60 * 60 * 24 * 365 * 2;

export const GET = async () => {
  const cutoffDate = new Date(Date.now() - TWO_YEARS_IN_MS);

  const [eventIds, sessionIds] = await prisma.$transaction([
    prisma.event.findMany({
      where: {
        created_at: {
          lt: cutoffDate,
        },
      },
      select: { id: true },
      take: DELETE_LIMIT,
      orderBy: { created_at: "asc" },
    }),
    prisma.session.findMany({
      where: {
        started_at: {
          lt: cutoffDate,
        },
      },
      select: { id: true },
      take: DELETE_LIMIT,
      orderBy: { started_at: "asc" },
    }),
  ]);

  const deletedEvents = eventIds.length
    ? await prisma.event.deleteMany({
        where: {
          id: {
            in: eventIds.map((event) => event.id),
          },
        },
      })
    : { count: 0 };

  const deletedSessions = sessionIds.length
    ? await prisma.session.deleteMany({
        where: {
          id: {
            in: sessionIds.map((session) => session.id),
          },
        },
      })
    : { count: 0 };

  return NextResponse.json({
    success: true,
    cutoffDate,
    deleted: {
      events: deletedEvents.count,
      sessions: deletedSessions.count,
    },
  });
};
