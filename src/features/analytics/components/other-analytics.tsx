"use client";
import React from "react";
import { WebsiteAnalytics } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
const OtherAnalytics = ({ data }: { data: WebsiteAnalytics }) => {
  const { theme } = useTheme();
  // Compute colors in JavaScript for dark/light theme
  const chartColors = {
    primary: theme === "dark" ? "#3b82f6" : "#2563eb",
    secondary: theme === "dark" ? "#8b5cf6" : "#7c3aed",
    tertiary: theme === "dark" ? "#ec4899" : "#db2777",
    quaternary: theme === "dark" ? "#f59e0b" : "#d97706",
    quinary: theme === "dark" ? "#10b981" : "#059669",
  };

  const textColor = theme === "dark" ? "#e5e7eb" : "#1f2937";
  const axisColor = theme === "dark" ? "#6b7280" : "#9ca3af";

  // Prepare page views data
  const pageData = data.pages.slice(0, 5).map((page: any) => ({
    name: page.page.split("/").pop() || "home",
    visits: page.visits,
  }));

  // Prepare device data
  const deviceData = Object.entries(data.devices).map(
    ([key, value]: [string, any]) => ({
      name: key,
      value: value,
    }),
  );

  // Prepare browser data
  const browserData = Object.entries(data.browsers).map(
    ([key, value]: [string, any]) => ({
      name: key,
      value: value,
    }),
  );

  // Prepare UTM source data
  const utmSourceData = Object.entries(data.utm_source || {})
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 6)
    .map(([key, value]: [string, any]) => ({
      name: key,
      visits: value,
    }));

  // Prepare UTM campaign data
  const utmCampaignData = Object.entries(data.utm_campaign || {}).map(
    ([key, value]: [string, any]) => ({
      name: key,
      value: value,
    }),
  );

  const COLORS = [
    chartColors.primary,
    chartColors.secondary,
    chartColors.tertiary,
    chartColors.quaternary,
    chartColors.quinary,
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Pages */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
          <CardDescription>Most visited pages</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pageData}>
              <CartesianGrid strokeDasharray="3 3" stroke={axisColor} />
              <XAxis dataKey="name" stroke={axisColor} fontSize={12} />
              <YAxis stroke={axisColor} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "#f9fafb",
                  border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
                  borderRadius: "0.5rem",
                }}
                cursor={{
                  fill:
                    theme === "dark"
                      ? "rgba(59, 130, 246, 0.1)"
                      : "rgba(37, 99, 235, 0.1)",
                }}
              />
              <Bar
                dataKey="visits"
                fill={chartColors.primary}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Traffic Sources */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
          <CardDescription>Where your visitors come from</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={utmSourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke={axisColor} />
              <XAxis dataKey="name" stroke={axisColor} fontSize={12} />
              <YAxis stroke={axisColor} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "#f9fafb",
                  border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
                  borderRadius: "0.5rem",
                }}
              />
              <Bar
                dataKey="visits"
                fill={chartColors.secondary}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Device Breakdown */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Devices</CardTitle>
          <CardDescription>Traffic by device type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill={chartColors.primary}
                dataKey="value"
              >
                {deviceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "#f9fafb",
                  border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
                  borderRadius: "0.5rem",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Campaigns */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
          <CardDescription>Performance by campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={utmCampaignData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill={chartColors.quaternary}
                dataKey="value"
              >
                {utmCampaignData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "#f9fafb",
                  border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
                  borderRadius: "0.5rem",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Browser Stats */}
      <Card className="border-border lg:col-span-2">
        <CardHeader>
          <CardTitle>Browser & OS</CardTitle>
          <CardDescription>
            Breakdown of browsers and operating systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-sm mb-4">Browsers</h4>
              <div className="space-y-2">
                {Object.entries(data.browsers).map(
                  ([browser, count]: [string, any]) => (
                    <div
                      key={browser}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-muted-foreground">{browser}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-4">Operating Systems</h4>
              <div className="space-y-2">
                {Object.entries(data.operating_systems).map(
                  ([os, count]: [string, any]) => (
                    <div
                      key={os}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-muted-foreground">{os}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OtherAnalytics;
