"use client";

import { useState } from "react";
import ChartCard from "@/features/reports/components/ChartCard";
import { Phone, Clock, Calendar, CheckCircle2, PhoneCall, Heart, StickyNote, ChevronLeft, ChevronRight } from "lucide-react";

const OUTCOME_STYLES = {
  "Connected":   "bg-emerald-50 text-emerald-700",
  "Interested":  "bg-blue-50 text-blue-700",
  "Follow-up":   "bg-amber-50 text-amber-700",
  "No Response": "bg-slate-100 text-slate-500",
};

const TIMELINE_CONFIG = {
  conversion: { icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  followup:   { icon: Clock,         color: "bg-amber-50 text-amber-600 border-amber-200" },
  call:       { icon: PhoneCall,     color: "bg-blue-50 text-blue-600 border-blue-200" },
  interested: { icon: Heart,         color: "bg-violet-50 text-violet-600 border-violet-200" },
  note:       { icon: StickyNote,    color: "bg-slate-50 text-slate-500 border-slate-200" },
};

export default function TelecallerActivityGrid({
  recentCalls = [],
  followups = [],
  timeline = [],
  isLoading,
  exportMode = false,
}) {
  // Pagination for follow-ups
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(followups.length / itemsPerPage) || 1;
  const paginatedFollowups = followups.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (exportMode) {
    // Stacked layout for print/PDF reports
    return (
      <div className="grid grid-cols-1 gap-5">
        <ChartCard
          title="Recent Calls"
          subtitle="Latest outbound call activity"
          isLoading={isLoading}
          skeletonHeight="260px"
        >
          {recentCalls.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left table-fixed text-[13px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-3 font-semibold text-slate-400 uppercase text-[11px] tracking-wider w-[32%]">Lead</th>
                    <th className="pb-3 font-semibold text-slate-400 uppercase text-[11px] tracking-wider w-[20%]">Course</th>
                    <th className="pb-3 font-semibold text-slate-400 uppercase text-[11px] tracking-wider w-[15%] text-center">Duration</th>
                    <th className="pb-3 font-semibold text-slate-400 uppercase text-[11px] tracking-wider w-[18%] text-center">Outcome</th>
                    <th className="pb-3 font-semibold text-slate-400 uppercase text-[11px] tracking-wider w-[15%] text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentCalls.map((call, i) => (
                    <tr key={i} className="h-[52px] hover:bg-slate-50/70 transition-colors group">
                      <td className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors truncate pr-2">
                        {call.lead}
                      </td>
                      <td className="text-slate-500 font-medium truncate pr-2">{call.course}</td>
                      <td className="text-slate-700 font-mono text-center">
                        <span className="inline-flex items-center gap-1">
                          <Phone size={12} className="text-slate-400" />
                          {call.duration}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${OUTCOME_STYLES[call.outcome] || "bg-slate-100 text-slate-600"}`}>
                          {call.outcome}
                        </span>
                      </td>
                      <td className="text-slate-400 text-[11px] text-right">{call.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Upcoming Follow-ups"
          subtitle="Pending student callbacks"
          isLoading={isLoading}
          skeletonHeight="260px"
        >
          {followups.length > 0 && (
            <div className="mt-4 space-y-3">
              {followups.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/60 border border-slate-100 transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 mt-0.5">
                    <Calendar size={14} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-bold text-slate-900 truncate">
                      {f.lead}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium mt-0.5">{f.course}</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                      <Clock size={10} className="text-slate-400 shrink-0" />
                      {f.due}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
      {/* 1. Recent Calls Card */}
      <div className="flex flex-col h-full">
        <ChartCard
          title="Recent Calls"
          subtitle="Latest outbound call activity"
          isLoading={isLoading}
          skeletonHeight="320px"
          className="h-full"
        >
          {recentCalls.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left table-fixed text-[13px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-3 font-semibold text-slate-400 uppercase text-[11px] tracking-wider w-[35%]">Lead</th>
                    <th className="pb-3 font-semibold text-slate-400 uppercase text-[11px] tracking-wider w-[35%]">Course</th>
                    <th className="pb-3 font-semibold text-slate-400 uppercase text-[11px] tracking-wider w-[30%] text-right">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentCalls.map((call, i) => (
                    <tr key={i} className="h-[52px] hover:bg-slate-50/70 transition-colors group">
                      <td className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors truncate pr-2">
                        {call.lead}
                      </td>
                      <td className="text-slate-500 font-medium truncate pr-2">{call.course}</td>
                      <td className="text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${OUTCOME_STYLES[call.outcome] || "bg-slate-100 text-slate-600"}`}>
                          {call.outcome}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-slate-400 font-medium">No recent calls</div>
          )}
        </ChartCard>
      </div>

      {/* 2. Upcoming Follow-ups Card with Pagination */}
      <div className="flex flex-col h-full">
        <ChartCard
          title="Upcoming Follow-ups"
          subtitle="Pending student callbacks"
          isLoading={isLoading}
          skeletonHeight="320px"
          className="h-full flex flex-col justify-between"
        >
          <div className="flex-1">
            {paginatedFollowups.length > 0 ? (
              <div className="mt-4 space-y-3">
                {paginatedFollowups.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/60 border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-xs transition-all group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-105 transition-transform mt-0.5">
                      <Calendar size={14} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                        {f.lead}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium mt-0.5">{f.course}</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                        <Clock size={10} className="text-slate-400 shrink-0" />
                        {f.due}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-slate-400 font-medium">No follow-ups</div>
            )}
          </div>

          {/* Pagination Controls */}
          {followups.length > itemsPerPage && (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-semibold text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </ChartCard>
      </div>

      {/* 3. Activity Timeline Card */}
      <div className="flex flex-col h-full">
        <ChartCard
          title="Activity Timeline"
          subtitle="Recent actions and notes"
          isLoading={isLoading}
          skeletonHeight="320px"
          className="h-full"
        >
          {timeline.length > 0 ? (
            <div className="mt-4 relative pl-3 max-h-[250px] overflow-y-auto custom-scrollbar">
              <div className="absolute left-[23px] top-2 bottom-2 w-px bg-slate-100" />
              <div className="space-y-1">
                {timeline.slice(0, 4).map((item, i) => {
                  const config = TIMELINE_CONFIG[item.type] || TIMELINE_CONFIG.note;
                  const Icon = config.icon;
                  return (
                    <div key={i} className="relative flex items-start gap-3 min-h-[64px] group">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 border ${config.color} transition-transform group-hover:scale-110`}>
                        <Icon size={12} />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5 pb-2">
                        <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors truncate">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-slate-400 font-medium">No activity log</div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
