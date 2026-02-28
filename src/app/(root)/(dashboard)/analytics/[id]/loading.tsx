"use client";

import { Card, CardContent } from "@/components/ui/card";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-muted/40 rounded-md ${className}
      before:absolute before:inset-0
      before:animate-shimmer
      before:bg-gradient-to-r
      before:from-transparent
      before:via-white/10
      animate-shimmer 
      before:to-transparent`}
    />
  );
}

export default function Loading() {
  return (
    <div className="space-y-6 mx-auto w-full max-w-6xl p-6">
      {/* Top Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="space-y-3">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-8 w-16" />
              <SkeletonBlock className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Pages + Traffic Sources */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="space-y-4">
              <SkeletonBlock className="h-5 w-40" />
              <SkeletonBlock className="h-[250px] w-full rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Devices + Campaigns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="space-y-4 flex flex-col items-center">
              <SkeletonBlock className="h-5 w-32 self-start" />
              <SkeletonBlock className="h-[220px] w-[220px] rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Browser & OS */}
      <Card className="bg-card border-border">
        <CardContent className="space-y-4">
          <SkeletonBlock className="h-5 w-40" />
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-3">
                <SkeletonBlock className="h-4 w-28" />
                <SkeletonBlock className="h-4 w-20" />
                <SkeletonBlock className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
