import prisma from "@/lib/db";
import { EventType } from "@/generated/prisma/enums";
import { z } from "zod";

type CreateVisitorSessionInput = {
  websiteId: string;
  visitorId: string;
  screenWidth?: number;
  utmCampaign?: string;
  utmSource?: string;
};

export async function createVisitorSession(
  data: CreateVisitorSessionInput,
): Promise<string> {
  const session = await prisma.session.create({
    data: {
      website_id: data.websiteId,
      visitor_id: data.visitorId,
      screen_width: data.screenWidth,
      utm_campaign: data.utmCampaign,
      utm_source: data.utmSource,
    },
    select: {
      id: true,
    },
  });

  return session.id;
}
export async function endVisitorSession(sessionId: string): Promise<boolean> {
  const session = await prisma.session.updateMany({
    where: {
      id: sessionId,
      ended_at: null, // only if still active
    },
    data: {
      ended_at: new Date(),
    },
  });

  return session.count > 0;
}

const eventSchema = z.object({
  websiteId: z.string().min(1),
  sessionId: z.string().min(1),
  visitorId: z.string().min(1),
  type: z.nativeEnum(EventType),
  url: z.string().url(),
  screenWidth: z.number().int().positive().optional(),
  activeTime: z.number().int().nonnegative().optional(),
  pathHistory: z.array(z.string()).optional(),
  rawPayload: z.any().optional(),
});

export async function createEvent(input: z.infer<typeof eventSchema>) {
  const parsed = eventSchema.safeParse(input);

  if (!parsed.success) {
    return null; // garbage ignored
  }

  const data = parsed.data;

  const baseData: any = {
    website_id: data.websiteId,
    session_id: data.sessionId,
    visitor_id: data.visitorId,
    type: data.type,
    url: data.url,
    screen_width: data.screenWidth,
    raw_payload: data.rawPayload,
  };

  // Only allow active_time for BLUR or EXIT
  if (data.type === EventType.PAGE_BLUR || data.type === EventType.PAGE_EXIT) {
    baseData.active_time = data.activeTime ?? 0;
  }

  // Only allow path_history for PATH_CHANGE
  if (
    data.type === EventType.PATH_CHANGE ||
    data.type === EventType.PAGE_EXIT
  ) {
    baseData.path_history = data.pathHistory ?? [];
  }

  try {
    return await prisma.event.create({
      data: baseData,
    });
  } catch {
    return null; // DB error? ignore.
  }
}
