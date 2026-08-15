"use client";

import React from "react";
import { KPICard } from "@/components/dashboard-ui/KPICard";
import { Phone, PhoneOutgoing, Clock, Mic, TrendingUp, CalendarDays } from "lucide-react";

export default function CallReportsStats({ stats = {} }) {
  const kpiConfig = [
    {
      key: "totalCalls",
      label: "Total Calls",
      icon: Phone,
      variant: "blue",
      value: stats.totalCalls ?? 148,
    },
    {
      key: "connectedCalls",
      label: "Connected",
      icon: PhoneOutgoing,
      variant: "success",
      value: stats.connectedCalls ?? 112,
    },
    {
      key: "avgDuration",
      label: "Avg Duration",
      icon: Clock,
      variant: "warning",
      value: stats.avgDuration ?? "03m 15s",
    },
    {
      key: "recordings",
      label: "Recordings",
      icon: Mic,
      variant: "purple",
      value: stats.recordings ?? 86,
    },
    {
      key: "successRate",
      label: "Success Rate",
      icon: TrendingUp,
      variant: "primary",
      value: stats.successRate ? `${stats.successRate}%` : "76%",
    },
    {
      key: "todaysCalls",
      label: "Today's Calls",
      icon: CalendarDays,
      variant: "danger",
      value: stats.todaysCalls ?? 34,
    },
  ];

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-6 font-outfit">
      {kpiConfig.map((kpi) => (
        <div key={kpi.key} className="hover:shadow-md hover:border-slate-300 transition-all duration-300 rounded-[24px]">
          <KPICard
            title={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
            variant={kpi.variant}
          />
        </div>
      ))}
    </section>
  );
}
