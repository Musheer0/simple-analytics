import { getWebsiteById } from "@/features/websites/actions/query";
import prisma from "@/lib/db";
import { getCountryCode } from "@/lib/get-country-code";
import { signJwtInfinite } from "@/lib/sign-jwt";
import { NextRequest, NextResponse } from "next/server";
import {UAParser} from 'ua-parser-js'
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }
}
// Handle preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  })
}

export const POST = async(req:NextRequest)=>{
    const body =await req.json()
    const origin = req.headers.get('referer');
    const user_agent = req.headers.get('user-agent');
    if(!origin) return NextResponse.json({success:false},{status:400})
    if(!user_agent) return NextResponse.json({success:false},{status:400});
    const website = await getWebsiteById(body.website_id);
    if(!website) return NextResponse.json({success:false},{status:404});
    console.log(website.domain,origin)
    // if(website.domain+'/' !== origin)return NextResponse.json({success:false},{status:400});
    const searchParams = req.nextUrl.searchParams;
    const referer = req.headers.get('referer');
    const ip = req.headers.get('x-forwarded-for')||"";
    const utm_campaign = searchParams.get('utm_campaign')||"";
    const utm_source = searchParams.get('utm_source')||"";
    const parser = new UAParser(user_agent)||""
    const browser =parser.getBrowser().name||""
    const device =parser.getDevice().model || 'unknown'
    const os = parser.getOS().name||""
    const device_type = parser.getDevice().type||"unknown"
    const country_code =await getCountryCode(ip)
    const visitor = await prisma.visitor.create({
        data:{
            website_id:website.id,
            first_page:origin,
            referrer:referer||"",
            browser,
            os,
            device,
            user_agent,
            ip,
            utm_campaign,
            utm_source,
            device_type,
            country_code:country_code
        }
    });
    const jwt_payload = {
        session:visitor.id,
        website_id:website.id
    }
    const jwt_token = signJwtInfinite(jwt_payload);
    const response = NextResponse.json({success:true},{status:200})
      response.cookies.set("_visitor_sa", jwt_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax", 
    path: "/",
    expires: new Date("2099-12-31T23:59:59.000Z") 
  });


 return response
}