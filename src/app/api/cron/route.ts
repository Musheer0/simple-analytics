import prisma from "@/lib/db";

export const GET = async () => {
  await prisma.session.deleteMany({
    where: {
      last_heartbeat: {
        lt: new Date(Date.now() - 60 * 60 * 1000),
      },
      ended_at: null,
    },
  });
};
