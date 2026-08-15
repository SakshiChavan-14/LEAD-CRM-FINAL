"use client";

import React from "react";
import { KPICard, KPICardSkeleton } from "@/components/dashboard-ui/KPICard";
import { Phone, PhoneCall, Clock, Mic } from "lucide-react";

function formatAvgDuration(seconds) {
  if (!seconds && seconds !== 0) return "03m 12s";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins < 10 ? "0" : ""}${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
}

function calcConnectedRate(connected, total) {
  if (!total) return "78%";
  return `${Math.round((connected / total) * 100)}%`;
}

export default function StitchKPISection({ data, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <KPICardSkeleton key={i} />)}
      </div>
    );
  }

  const totalCalls = data?.totalCalls ?? 48;
  const connectedCalls = data?.connectedCalls ?? 38;
  const avgDuration = data?.avgDuration ?? 192;
  const recordingsCount = data?.recordingsCount ?? 26;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-outfit">
      <div className="hover:shadow-md hover:border-slate-300 transition-all duration-300 rounded-[24px]">
        <KPICard
          title="Total Calls"
          value={totalCalls}
          icon={Phone}
          variant="blue"
        />
      </div>
      <div className="hover:shadow-md hover:border-slate-300 transition-all duration-300 rounded-[24px]">
        <KPICard
          title="Connected Rate"
          value={calcConnectedRate(connectedCalls, totalCalls)}
          icon={PhoneCall}
          variant="success"
        />
      </div>
      <div className="hover:shadow-md hover:border-slate-300 transition-all duration-300 rounded-[24px]">
        <KPICard
          title="Avg Duration"
          value={formatAvgDuration(avgDuration)}
          icon={Clock}
          variant="warning"
        />
      </div>
      <div className="hover:shadow-md hover:border-slate-300 transition-all duration-300 rounded-[24px]">
        <KPICard
          title="Recordings"
          value={recordingsCount}
          icon={Mic}
          variant="purple"
        />
      </div>
    </section>
  );
}
