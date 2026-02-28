"use server";
import { TTL } from "@/constants";
import { Website } from "@/generated/prisma/client";
import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { redisKeys } from "@/lib/redis-key-registry";
import { RequireAuth } from "@/lib/requireAuth";

export const getWebsitePaginatedNoCache = async (cursor?: number) => {
  const { orgId } = await RequireAuth();
  if (!orgId) throw new Error("please create an organization first");
  if (cursor) {
    const websites = await prisma.website.findMany({
      where: {
        org_id: orgId,
        created_at: { lt: new Date(cursor) },
      },
      take: 11,
    });
    const nextCursor = websites.length > 10 ? websites[10].created_at : null;
    return {
      websites: websites.slice(0, 10),
      nextCursor: nextCursor?.getTime(),
    };
  }
  const websites = await prisma.website.findMany({
    where: {
      org_id: orgId,
    },
    take: 11,
    orderBy:{
      created_at:'desc'
    }
  });
  const nextCursor = websites.length > 10 ? websites[10].created_at : null;
  return {
    websites: websites.slice(0, 10),
    nextCursor: nextCursor?.getTime(),
  };
};

export const getWebsiteById = async (id: string) => {
  var website = await redis.get<Website>(redisKeys.WEBSITE_KEY_BY_ID(id));
  website = website || (await prisma.website.findFirst({ where: { id } }));
  if (website)
    await redis.set(redisKeys.WEBSITE_KEY_BY_ID(id), website, {
      ex: TTL.WEEK_1,
    });
  return website;
};
