"use client";

import React from "react";
import { Users, Zap, Clock, CheckCircle2, XCircle, Star } from "lucide-react";
import { KPICard } from "@/components/dashboard-ui/KPICard";

export default function MyLeadsKPISection({ kpiData }) {
  const {
    totalAssigned = 38,
    newLeads = 12,
    inProgress = 14,
    interested = 8,
    notInterested = 2,
    converted = 2,
  } = kpiData || {};

  const kpis = [
    {
      title: "Assigned",
      value: totalAssigned,
      icon: Users,
      variant: "blue",
    },
    {
      title: "New Leads",
      value: newLeads,
      icon: Zap,
      variant: "info",
    },
    {
      title: "In Progress",
      value: inProgress,
      icon: Clock,
      variant: "warning",
    },
    {
      title: "Interested",
      value: interested,
      icon: CheckCircle2,
      variant: "success",
    },
    {
      title: "Not Interested",
      value: notInterested,
      icon: XCircle,
      variant: "neutral",
    },
    {
      title: "Converted",
      value: converted,
      icon: Star,
      variant: "purple",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 font-outfit">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="hover:shadow-md hover:border-slate-300 transition-all duration-300 rounded-[24px]">
          <KPICard
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            variant={kpi.variant}
          />
        </div>
      ))}
    </div>
  );
}
