"use server"
import { auth } from "@clerk/nextjs/server"
import { AddWebsiteSchema, AddWebsiteSchemaType } from "../schemas/website-schemas"
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { redisKeys } from "@/lib/redis-key-registry";

export const AddWebsite = async(payload:AddWebsiteSchemaType)=>{
    const {userId, orgId, orgRole, orgSlug}  = await auth();
    const {success} = AddWebsiteSchema.safeParse(payload)
    if(!success) throw new Error("Cannot process this data");
    if(!userId || !orgId ||!orgRole ||!orgSlug) redirect('/sign-in');
    const new_website = await prisma.website.create({
        data:{
            domain:payload.domain,
            user_id:userId,
            org_id:orgId
        }
    });
    await redis.set(redisKeys.WEBSITE_KEY_BY_ORG(new_website.id, orgId),new_website);
    return new_website
}