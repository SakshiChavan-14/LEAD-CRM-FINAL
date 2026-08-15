"use client";

import React, { useMemo } from "react";
import { Award, Trophy, Star, ArrowRight } from "lucide-react";
import { useCallReportsSummary } from "@/features/callReports/hooks/useCallReports";
import { EmptyState } from "@/components/dashboard-ui/EmptyState";
import Link from "next/link";

const cardClass = "rounded-[24px] border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col font-outfit justify-between overflow-hidden h-[420px] w-full";

export default function TopPerformersList() {
  const { data: rawData, isLoading } = useCallReportsSummary({}, 0, 100);

  const topPerformers = useMemo(() => {
    const list = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.content) ? rawData.content : [];
    if (list.length === 0) return [];

    const mapped = list.map((tc) => {
      const admissions = Number(tc.totalAdmissions || tc.admissions || 0);
      const calls = Number(tc.totalCalls || tc.calls || 0);
      
      // Handle conversion rate safely
      let rate = 0;
      if (tc.conversionRate !== undefined) {
        rate = Number(String(tc.conversionRate).replace("%", ""));
      } else {
        rate = calls > 0 ? (admissions / calls) * 100 : 0;
      }

      return {
        id: tc.empId || tc.id,
        name: tc.empName || tc.name || "Agent",
        avatar: tc.photo || tc.avatar || null,
        admissions,
        calls,
        rate,
      };
    });

    // Sort by conversion rate descending, then admissions descending
    return mapped
      .sort((a, b) => b.rate - a.rate || b.admissions - a.admissions)
      .slice(0, 3);
  }, [rawData]);

  const awardIcons = [
    { icon: Trophy, color: "text-amber-500 bg-amber-50 border-amber-200/50", label: "1st Place" },
    { icon: Award, color: "text-slate-400 bg-slate-50 border-slate-200/50", label: "2nd Place" },
    { icon: Star, color: "text-amber-700 bg-amber-50/50 border-amber-800/20", label: "3rd Place" }
  ];

  return (
    <article className={cardClass}>
      {/* Header */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Top Performers</h2>
          <p className="text-xs text-slate-500 mt-1">Lead conversion leaderboard this period</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-slate-100 rounded-2xl w-full" />
            ))}
          </div>
        </div>
      ) : topPerformers.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <EmptyState
            title="No Leaderboard Available"
            description="Leaderboard will calculate once calls and conversions are registered."
            icon={Trophy}
          />
        </div>
      ) : (
        /* Leaderboard entries */
        <div className="flex-grow flex flex-col justify-start gap-3 mt-5">
          {topPerformers.map((agent, index) => {
            const BadgeConfig = awardIcons[index] || awardIcons[2];
            const BadgeIcon = BadgeConfig.icon;

            return (
              <Link
                key={`${agent.id || 'agent'}-${index}`}
                href={`/dashboard/management/user-directory/${agent.id}`}
                className="flex items-center justify-between p-3.5 border border-slate-100 rounded-2xl hover:bg-slate-50/90 transition-all duration-300 cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {/* Position Badge */}
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 shadow-3xs ${BadgeConfig.color}`}>
                    <BadgeIcon size={16} />
                  </div>

                  {/* Profile Picture & Details */}
                  {agent.avatar ? (
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200/50 shadow-2xs"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0 border border-slate-200/50">
                      {agent.name.charAt(0)}
                    </div>
                  )}

                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors leading-tight">
                      {agent.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5 leading-none">
                      ID: {agent.id}
                    </span>
                  </div>
                </div>

                {/* Conversion Stats */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block font-mono">
                      {agent.rate.toFixed(1)}%
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold block leading-none mt-0.5">
                      {agent.admissions} converts
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </article>
  );
}
