"use server";
import { auth } from "@clerk/nextjs/server";
import {
  AddWebsiteSchema,
  AddWebsiteSchemaType,
} from "../schemas/website-schemas";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { redisKeys } from "@/lib/redis-key-registry";
import { TTL } from "@/constants";
import { getWebsiteById } from "./query";
export const AddWebsite = async (payload: AddWebsiteSchemaType) => {
  const { userId, orgId, orgRole, orgSlug } = await auth();
  const { success, error } = AddWebsiteSchema.safeParse(payload);
  if (!success) throw new Error(error.message);
  if (!userId || !orgId || !orgRole || !orgSlug) redirect("/sign-in");
  let new_website;
  try {
    new_website = await prisma.website.create({
      data: {
        domain: payload.domain,
        user_id: userId,
        org_id: orgId,
      },
    });
    await redis.set(
      redisKeys.WEBSITE_KEY_BY_ORG(new_website.id, orgId),
      new_website,
    );
    await redis.set(redisKeys.WEBSITE_KEY_BY_ID(new_website.id), new_website, {
      ex: TTL.HOUR_6,
    });
    return new_website;
  } catch (e: any) {
    if (e?.code === "P2002")
      throw new Error("This domain is already registered.");
    throw new Error("Failed to create website.");
  }
};
export const DeleteWebsite = async(id:string)=>{
  const { userId, orgId, orgRole, orgSlug } = await auth();
  if (!userId || !orgId || !orgRole || !orgSlug) redirect("/sign-in");
  const website = await getWebsiteById(id);
  if(!website) throw new Error("website not found");
  if(website.org_id!==orgId) throw new Error("Forbidden");
  try {
    await prisma.website.delete({
      where:{id}
    });
    await redis.del(redisKeys.WEBSITE_KEY_BY_ID(website.id))
    await redis.del(redisKeys.WEBSITE_KEY_BY_ORG(website.id,orgId));
    return id
  } catch (error) {
    throw new Error("error deleting website try again")
  }
}