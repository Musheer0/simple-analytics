"use server";
import prisma from "@/lib/db";
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
  });
  const nextCursor = websites.length > 10 ? websites[10].created_at : null;
  return {
    websites: websites.slice(0, 10),
    nextCursor: nextCursor?.getTime(),
  };
};
