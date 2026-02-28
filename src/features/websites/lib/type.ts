import { Website } from "@/generated/prisma/client";

export type pagniatedWebsiteQuery = {
  websites: Website[];
  nextCursor?: number;
};
