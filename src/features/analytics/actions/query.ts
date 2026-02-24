import { Visitor } from "@/generated/prisma/client";
import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { redisKeys } from "@/lib/redis-key-registry";

export const getVisitor = async (
  websiteId: string,
  visitorId: string,
): Promise<Visitor | null> => {
  const cache = await redis.get<Visitor>(
    redisKeys.PIXEL_VISITOR_KEY(websiteId, visitorId),
  );
  if (cache) return cache;
  const visitor = await prisma.visitor.findFirst({
    where: {
      website_id: websiteId,
      id: visitorId,
    },
  });
  return visitor;
};
