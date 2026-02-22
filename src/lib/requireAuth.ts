import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export const RequireAuth = async()=>{
    const session = await auth()
    if(!session.userId) redirect('/sign-in');
    return session;
}