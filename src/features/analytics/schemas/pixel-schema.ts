import { z } from "zod";
import { EventType } from "@/generated/prisma/enums";

const eventIngestSchema = z
  .object({
    type: z.nativeEnum(EventType),

    website_id: z.string().min(1).max(100),

    url: z.string().url().max(2000),

    screenWidth: z.number().int().positive().max(10000).optional(),

    utm_campaign: z.string().max(200).optional().nullable(),

    utm_source: z.string().max(200).optional().nullable(),
    active_time: z.number().optional(),
    path_history: z.array(z.string()).optional(),
  })

  .passthrough(); // allow ...extra but don’t validate deeply

export function validateEventBody(input: unknown) {
  const parsed = eventIngestSchema.safeParse(input);
  console.log(parsed.error);
  if (!parsed.success) {
    return null; // ignore garbage
  }

  return parsed.data;
}
