"use client";

import React from "react";
import { BarChart3, Phone, PhoneCall, Heart, CheckCircle2, Target } from "lucide-react";

export default function MyPerformanceCard({ isLoading, summary }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-[24px] shadow-xs p-5 flex flex-col min-h-[340px] animate-pulse font-outfit justify-between">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-slate-100" />
          <div className="h-5 w-32 bg-slate-100 rounded" />
        </div>
        <div className="space-y-4 my-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 w-24 bg-slate-100 rounded" />
              <div className="h-4 w-8 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
        <div className="h-11 bg-slate-100 rounded-xl" />
      </div>
    );
  }

  const callsToday = summary?.callsToday || 0;
  const connected = summary?.connected || 0;
  const interested = summary?.interested || 0;
  const conversions = summary?.admissions || summary?.conversions || 0;
  const assigned = summary?.assigned || 0;

  const conversionRate = assigned > 0 
    ? ((conversions / assigned) * 100).toFixed(1) 
    : (summary?.conversionRate || 0.0);

  const metrics = [
    {
      label: "Total Calls",
      value: callsToday,
      icon: Phone,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      label: "Connected",
      value: connected,
      icon: PhoneCall,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    {
      label: "Interested",
      value: interested,
      icon: Heart,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
    },
    {
      label: "Conversions",
      value: conversions,
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
  ];

  return (
    <div id="performance" className="bg-white border border-slate-200/80 rounded-[24px] shadow-xs p-5 flex flex-col min-h-[340px] justify-between font-outfit hover:shadow-md transition-all duration-300 h-full scroll-mt-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100/70 shrink-0">
            <BarChart3 size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">My Performance</h2>
          </div>
        </div>
      </div>

      {/* 4 Rows */}
      <div className="space-y-3.5 my-3 flex-1 flex flex-col justify-center">
        {metrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-none">
              <div className="flex items-center gap-2.5">
                <div className={`w-6 h-6 rounded-lg ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}>
                  <Icon size={13} />
                </div>
                <span className="text-xs font-semibold text-slate-600">{item.label}</span>
              </div>
              <span className="text-sm font-black text-slate-900 font-mono">{item.value}</span>
            </div>
          );
        })}
      </div>

      {/* Bottom Conversion Rate Pill */}
      <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-xl px-3.5 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-purple-100/80 text-purple-700 flex items-center justify-center">
            <Target size={14} />
          </div>
          <span className="text-xs font-bold text-purple-900">Conversion Rate</span>
        </div>
        <span className="text-sm font-black text-purple-700 font-mono">{conversionRate}%</span>
      </div>
    </div>
  );
}
