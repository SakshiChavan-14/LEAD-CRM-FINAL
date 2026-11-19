"use client";

import React from "react";
import { Phone, CheckCircle2, PhoneOff, Clock, FileAudio, Percent, PhoneMissed, Timer } from "lucide-react";
import { calculateCallMetrics } from "../utils/callHistoryMetrics";

export default function RecentCallsKPIs({ calls, activeFilter, onFilterChange }) {
  const metrics = calculateCallMetrics(calls || []);

  const kpiConfig = [
    {
      id: "all",
      title: "Total Calls",
      value: metrics.totalCalls || 0,
      icon: Phone,
      colorClass: "text-blue-600",
      bgClass: "bg-blue-50",
      borderHover: "hover:border-blue-300",
    },
    {
      id: "connected",
      title: "Connected",
      value: metrics.connectedCalls || 0,
      icon: CheckCircle2,
      colorClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
      borderHover: "hover:border-emerald-300",
    },
    {
      id: "missed",
      title: "Missed",
      value: metrics.missedCalls || 0,
      icon: PhoneMissed,
      colorClass: "text-rose-600",
      bgClass: "bg-rose-50",
      borderHover: "hover:border-rose-300",
    },
    {
      id: "busy",
      title: "Busy / Failed",
      value: metrics.busyCalls || 0,
      icon: PhoneOff,
      colorClass: "text-amber-600",
      bgClass: "bg-amber-50",
      borderHover: "hover:border-amber-300",
    },
    {
      id: "avg_duration",
      title: "Avg Duration",
      value: metrics.averageDuration || "02:15",
      icon: Clock,
      colorClass: "text-purple-600",
      bgClass: "bg-purple-50",
      borderHover: "hover:border-purple-300",
    },
    {
      id: "recordings",
      title: "Recordings",
      value: metrics.recordings || 0,
      icon: FileAudio,
      colorClass: "text-cyan-600",
      bgClass: "bg-cyan-50",
      borderHover: "hover:border-cyan-300",
    },
    {
      id: "connection_rate",
      title: "Connection Rate",
      value: metrics.connectionRate || "75%",
      icon: Percent,
      colorClass: "text-blue-600",
      bgClass: "bg-blue-50",
      borderHover: "hover:border-blue-300",
    },
    {
      id: "longest_call",
      title: "Longest Call",
      value: metrics.longestCall || "08:45",
      icon: Timer,
      colorClass: "text-indigo-600",
      bgClass: "bg-indigo-50",
      borderHover: "hover:border-indigo-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5 font-outfit">
      {kpiConfig.map((kpi) => {
        const Icon = kpi.icon;
        const isActive = activeFilter === kpi.id || (kpi.id === "all" && activeFilter === "today");

        return (
          <div
            key={kpi.id}
            onClick={() => onFilterChange && onFilterChange(isActive ? "all" : kpi.id)}
            className={`bg-white border rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 cursor-pointer group shadow-2xs ${
              isActive 
                ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md bg-blue-50/30 scale-[1.02]" 
                : `border-slate-200/80 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 ${kpi.borderHover}`
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${kpi.bgClass} ${kpi.colorClass} flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs shrink-0`}>
                <Icon size={18} />
              </div>
            </div>

            <div className="min-w-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                {kpi.title}
              </span>
              <span className="text-xl font-extrabold text-slate-900 font-mono tracking-tight block mt-0.5 group-hover:text-blue-600 transition-colors">
                {kpi.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
