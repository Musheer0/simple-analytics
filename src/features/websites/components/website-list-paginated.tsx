"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getWebsitePaginatedNoCache } from "../actions/query";
import type { pagniatedWebsiteQuery } from "../lib/type";
import { format } from "date-fns";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { Globe, CalendarDays, Loader2 } from "lucide-react";
import Link from "next/link";

const WebsiteListPaginated = ({ orgId }: { orgId: string }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery<pagniatedWebsiteQuery>({
    queryKey: ["website-list", orgId],
    queryFn: ({ pageParam }) =>
      getWebsitePaginatedNoCache(pageParam as number | undefined),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  if (status === "pending") {
    return (
      <div className="w-full mx-auto p-6 px-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="space-y-3 p-5">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex justify-center py-16 text-destructive">
        {(error as Error).message}
      </div>
    );
  }

  const websites = data?.pages.flatMap((page) => page.websites) ?? [];

  if (!websites.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
        <Globe className="w-10 h-10 opacity-50" />
        <p>No websites found</p>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-6 px-4 space-y-8">
      <div className="flex w-full flex-wrap gap-5">
        {websites.map((website) => (
          <WebsiteCard key={website.id} website={website} />
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="gap-2"
        >
          {isFetchingNextPage && <Loader2 className="w-4 h-4 animate-spin" />}

          {hasNextPage ? "Load More" : "No More Websites"}
        </Button>
      </div>
    </div>
  );
};

export default WebsiteListPaginated;

// -------------------------------
// Website Card
// -------------------------------

type WebsiteCardProps = {
  website: {
    id: string;
    domain: string;
    created_at: Date;
  };
};

const WebsiteCard = ({ website }: WebsiteCardProps) => {
  return (
    <Link href={`/analytics/${website.id}`}>
      <Card className="w-full  sm:w-[300px] transition hover:shadow-md hover:-translate-y-1 duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base font-semibold truncate">
            {website.domain}
          </CardTitle>

          <Badge variant="outline" className="gap-1 shrink-0">
            <Globe className="w-3 h-3" />
            Website
          </Badge>
        </CardHeader>

        <CardContent className="text-sm text-muted-foreground flex items-center gap-2">
          <CalendarDays className="w-4 h-4 shrink-0" />
          {format(new Date(website.created_at), "dd MMM yyyy")}
        </CardContent>
      </Card>
    </Link>
  );
};
