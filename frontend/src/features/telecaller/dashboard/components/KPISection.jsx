"use client";

import React from "react";
import { Users, PhoneCall, Heart, CheckCircle2, Target, PhoneOutgoing } from "lucide-react";
import { KPICard, KPICardSkeleton } from "@/components/dashboard-ui/KPICard";

export default function KPISection({ isLoading, summary }) {
  if (isLoading) {
    return (
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => <KPICardSkeleton key={i} />)}
      </section>
    );
  }

  const safeSummary = summary || {
    assigned: 0,
    callsToday: 0,
    connected: 0,
    interested: 0,
    admissions: 0,
    goal: 0
  };

  const kpis = [
    {
      title: "Assigned",
      value: safeSummary.assigned ?? 0,
      icon: Users,
      variant: "blue",
      href: "/telecaller/leads?status=ALL",
    },
    {
      title: "Calls Today",
      value: safeSummary.callsToday ?? 0,
      icon: PhoneCall,
      variant: "warning",
      href: "/telecaller/calls?date=today",
    },
    {
      title: "Connected",
      value: safeSummary.connected ?? 0,
      icon: PhoneOutgoing,
      variant: "success",
      href: "/telecaller/calls?status=CONNECTED",
    },
    {
      title: "Interested",
      value: safeSummary.interested ?? 0,
      icon: Heart,
      variant: "purple",
      href: "/telecaller/leads?status=INTERESTED",
    },
    {
      title: "Admissions",
      value: safeSummary.admissions ?? 0,
      icon: CheckCircle2,
      variant: "primary",
      href: "/telecaller/leads?status=ADMISSION",
    },
    {
      title: "Goal %",
      value: `${safeSummary.goal ?? 0}%`,
      icon: Target,
      variant: "danger",
    },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 font-outfit">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="hover:shadow-md hover:border-slate-300 transition-all duration-300 rounded-[24px]">
          <KPICard
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            variant={kpi.variant}
            href={kpi.href}
          />
        </div>
      ))}
    </section>
  );
}
