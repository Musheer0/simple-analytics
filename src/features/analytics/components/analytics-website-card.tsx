"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Website } from "@/generated/prisma/client";
import React from "react";
import { InstallDialog } from "./install-analytics-dialog";
import { ANALYTICS_TIME } from "@/constants";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const AnalyticsWebsiteCard = ({ website }: { website: Website }) => {
  const router = useRouter();
  const searchparams = useSearchParams();
  const range = searchparams.get("range") || "ONE_WEEK";
  const time_ranges: { name: string; value: keyof typeof ANALYTICS_TIME }[] = [
    {
      name: "last 24 hours",
      value: "ONE_DAY",
    },
    {
      name: "last 7 days",
      value: "ONE_WEEK",
    },
    {
      name: "last 1 month",
      value: "ONE_MONTH",
    },
    {
      name: "last 3 months",
      value: "THREE_MONTHS",
    },
    {
      name: "last 12 months",
      value: "ONE_YEAR",
    },
    {
      name: "last 24 months",
      value: "TWO_YEAR",
    },
  ];
  return (
    <div className="w-fll flex items-center justify-between py-5">
      <div className="left flex items-center gap-2">
        <Link href={"/websites"} className="px-4">
          <HugeiconsIcon icon={ArrowLeft} />
        </Link>
        <div className="website flex items-center gap-2   ">
          <img
            className="w-7 h-7"
            src={website.domain + "/favicon.ico"}
            alt="website favicon"
          />
          <p className="font-semibold text-sm">
            {
              website.domain.split(
                website.domain.includes("http://") ? "http://" : "https://",
              )[1]
            }
          </p>
        </div>
      </div>
      <div className="right flex items-center gap-2">
        <InstallDialog id={website.id} />
        <Select
          defaultValue={range}
          onValueChange={(e) => {
            router.push(`?range=${e}`);
            router.refresh();
          }}
        >
          <SelectTrigger className="" defaultValue={range}>
            <SelectValue placeholder="Time Range" defaultValue={range} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup defaultValue={range}>
              {time_ranges.map((r) => (
                <SelectItem value={r.value}>{r.name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AnalyticsWebsiteCard;
