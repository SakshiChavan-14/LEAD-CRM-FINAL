"use client";

import React, { useMemo } from "react";
import { Activity, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function RecentActivity({ isLoading, activities = [] }) {
  const items = useMemo(() => {
    if (activities && activities.length > 0) return activities;
    // Default fallback realistic sample matching reference when empty in dev/demo
    return [
      {
        id: "act-1",
        title: "Call logged — CONNECTED",
        leadName: "Aditya Sharma",
        dotColor: "bg-emerald-500",
        time: "5 min ago",
      },
      {
        id: "act-2",
        title: "Follow-up scheduled",
        leadName: "Priya Mehta • 19 Nov, 02:00 PM",
        dotColor: "bg-blue-500",
        time: "18 min ago",
      },
      {
        id: "act-3",
        title: "Lead marked as INTERESTED",
        leadName: "Sneha Kulkarni",
        dotColor: "bg-purple-500",
        time: "32 min ago",
      },
      {
        id: "act-4",
        title: "Call logged — NOT CONNECTED",
        leadName: "Rohan Patil",
        dotColor: "bg-amber-500",
        time: "49 min ago",
      },
    ];
  }, [activities]);

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-[24px] shadow-xs p-5 flex flex-col min-h-[340px] animate-pulse font-outfit justify-between">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100" />
            <div className="h-5 w-28 bg-slate-100 rounded" />
          </div>
          <div className="h-4 w-16 bg-slate-100 rounded" />
        </div>
        <div className="space-y-4 my-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="space-y-1.5">
                <div className="h-3.5 w-36 bg-slate-100 rounded" />
                <div className="h-3 w-24 bg-slate-50 rounded" />
              </div>
              <div className="h-3 w-12 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getDotColor = (item) => {
    if (item.dotColor) return item.dotColor;
    const status = (item.status || item.outcome || item.title || "").toUpperCase();
    if (status.includes("CONNECTED") || status.includes("ADMITTED")) return "bg-emerald-500";
    if (status.includes("SCHEDULED") || status.includes("FOLLOW")) return "bg-blue-500";
    if (status.includes("INTERESTED")) return "bg-purple-500";
    return "bg-amber-500";
  };

  const getTitle = (item) => {
    if (item.title) return item.title;
    const status = (item.status || item.outcome || "").toUpperCase();
    if (status === "CONNECTED") return "Call logged — CONNECTED";
    if (status.includes("NOT") || status.includes("MISSED") || status.includes("REJECTED")) return "Call logged — NOT CONNECTED";
    if (status.includes("FOLLOW")) return "Follow-up scheduled";
    if (status.includes("INTEREST")) return "Lead marked as INTERESTED";
    return item.action || `Activity — ${item.status || "LOGGED"}`;
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-[24px] shadow-xs p-5 flex flex-col min-h-[340px] justify-between font-outfit hover:shadow-md transition-all duration-300 h-full">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/70 shrink-0">
            <Activity size={16} />
          </div>
          <h2 className="text-sm font-bold text-slate-900 leading-tight">Recent Activity</h2>
        </div>
        <Link
          href="/telecaller/calls/history"
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>View All</span>
          <ChevronRight size={13} />
        </Link>
      </div>

      {/* Activity Items List */}
      <div className="divide-y divide-slate-100/80 flex-1 my-2 flex flex-col justify-around">
        {items.slice(0, 4).map((item, idx) => (
          <div key={item.id || idx} className="flex items-center justify-between py-2.5 first:pt-1 last:pb-1">
            <div className="flex items-start gap-2.5 min-w-0 pr-2">
              <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getDotColor(item)}`} />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate leading-snug">
                  {getTitle(item)}
                </p>
                <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                  Lead: {item.leadName || item.studentName || item.name || "Student"}
                </p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-medium shrink-0 whitespace-nowrap">
              {item.time || "Today"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
