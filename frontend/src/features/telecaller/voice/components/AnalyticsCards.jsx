"use client";

import React from "react";
import {
  Phone, PhoneIncoming, PhoneOutgoing, Clock, TrendingUp, Timer, Zap, BarChart3, Target, AlertCircle, Mic, Headphones
} from "lucide-react";
import { useVoiceAnalytics } from "../hooks/useVoiceAnalytics";
import { formatDuration } from "../utils/callMapper";
import { KPICard, KPICardSkeleton } from "@/components/dashboard-ui/KPICard";

const AnalyticsSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
    {[...Array(6)].map((_, i) => (
      <KPICardSkeleton key={i} />
    ))}
  </div>
);

export default function AnalyticsCards() {
  const { analytics, isLoading } = useVoiceAnalytics();

  if (isLoading) return <AnalyticsSkeleton />;

  const cards = [
    {
      label: "Calls Today",
      value: analytics?.callsToday || 0,
      icon: Phone,
      variant: "blue",
    },
    {
      label: "Connected",
      value: analytics?.connected || 0,
      icon: PhoneOutgoing,
      variant: "success",
    },
    {
      label: "Busy / Missed",
      value: (analytics?.busy || 0) + (analytics?.noResponse || 0),
      icon: AlertCircle,
      variant: "warning",
    },
    {
      label: "Avg Duration",
      value: formatDuration(analytics?.avgDuration || 145),
      icon: Timer,
      variant: "purple",
    },
    {
      label: "Total Talk Time",
      value: formatDuration(analytics?.totalDuration || 1350),
      icon: Clock,
      variant: "info",
    },
    {
      label: "Connection Rate",
      value: `${analytics?.connectionRate || 75}%`,
      icon: BarChart3,
      variant: "cyan",
    },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-300 p-6 font-outfit">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Today's Call Performance</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Real-time voice operations metrics</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {cards.map((card) => (
          <KPICard
            key={card.label}
            title={card.label}
            value={card.value}
            icon={card.icon}
            variant={card.variant}
          />
        ))}
      </div>
    </div>
  );
}
