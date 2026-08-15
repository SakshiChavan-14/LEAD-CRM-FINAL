"use client";

import React from "react";
import { KPICard } from "@/components/dashboard-ui/KPICard";
import { Users, Snowflake, Flame, CheckCircle2, PhoneMissed, RefreshCcw } from "lucide-react";

const kpiConfig = [
  {
    key: "all",
    label: "All Leads",
    icon: Users,
    variant: "blue",

  },
  {
    key: "cold",
    label: "Cold Leads",
    icon: Snowflake,
    variant: "blue",


  },
  {
    key: "hot",
    label: "Hot Leads",
    icon: Flame,
    variant: "danger",

  },
  {
    key: "alloted",
    label: "Alloted",
    icon: CheckCircle2,
    variant: "success",

  },
  {
    key: "not-consulted",
    label: "Not Consulted",
    icon: PhoneMissed,
    variant: "primary",

  },
  {
    key: "opinion-reassign",
    label: "Opinion Reassign",
    icon: RefreshCcw,
    variant: "default",

  },
];

import KPIGrid from "@/components/management/KPIGrid";

export default function LeadsKPICards({ counts = {} }) {
  return (
    <KPIGrid className="grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
      {kpiConfig.map(({ key, label, icon, variant, trend, trendDirection, note }) => (
        <KPICard
          key={key}
          title={label}
          value={counts[key]}
          icon={icon}
          variant={variant}
          trend={trend}
          trendDirection={trendDirection}
          subtitle={note}
        />
      ))}
    </KPIGrid>
  );
}
