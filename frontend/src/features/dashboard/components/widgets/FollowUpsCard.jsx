"use client";

import React from "react";
import { Calendar, Phone, MessageCircle, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/dashboard-ui/EmptyState";

const PRIORITY_STYLES = {
  High: { bg: "bg-rose-50 border-rose-200/80", text: "text-rose-700", label: "HIGH" },
  Medium: { bg: "bg-amber-50 border-amber-200/80", text: "text-amber-700", label: "MEDIUM" },
  Low: { bg: "bg-blue-50 border-blue-200/80", text: "text-blue-700", label: "LOW" },
};

const cardClass = "rounded-[24px] border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-6 h-[420px] flex flex-col justify-between font-outfit overflow-hidden";

export default function FollowUpsCard({ followups }) {
  const upcomingError = followups?.upcoming?.error;
  const overdueError = followups?.overdue?.error;

  const upcomingData = followups?.upcoming?.data || [];
  const overdueData = followups?.overdue?.data || [];

  // Combine overdue and upcoming for display
  const data = [...overdueData, ...upcomingData];

  if (upcomingError || overdueError) {
    return (
      <div className="h-[420px] flex items-center justify-center">
        <EmptyState title="Failed to load follow-ups" description="An error occurred while fetching follow-ups." />
      </div>
    );
  }

  const getPriorityStyle = (priority) => {
    const key = typeof priority === "string"
      ? priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()
      : "Medium";
    return PRIORITY_STYLES[key] || PRIORITY_STYLES.Medium;
  };

  return (
    <article className={cardClass}>
      {/* Header */}
      <div className="flex justify-between items-center mb-2 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Today&apos;s Follow-ups</h2>
            <span className="text-[11px] font-bold bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-1">
              <Clock size={11} className="text-amber-600" />
              {data.length} Tasks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Pending student callbacks and actions</p>
        </div>
      </div>

      {/* Follow-ups List Container */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow text-center text-slate-400 py-10">
          <Calendar size={36} className="text-slate-300 mb-2.5" />
          <p className="text-sm font-bold text-slate-800">No follow-ups scheduled for today.</p>
          <p className="text-xs text-slate-400 mt-0.5">All student callbacks are caught up for today!</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 mt-2 max-h-[300px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {data.map((item, index) => {
            const priorityStyle = getPriorityStyle(item.priority);
            const isOverdue = item.status === "Overdue";

            return (
              <Link
                key={item.id || index}
                href={`/dashboard/management/leads/${item.id}`}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Action Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105 ${
                    isOverdue ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}>
                    {isOverdue ? <Clock size={15} /> : <Phone size={15} />}
                  </div>

                  {/* Name + Telecaller + Time + Course */}
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                        {item.student || "Unknown Student"}
                      </span>
                      {item.telecaller && (
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">
                          • {item.telecaller}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5 truncate">
                      <Clock size={9} className="text-slate-400 shrink-0" />
                      {item.time || "Today"}
                      {item.course ? ` • ${item.course}` : ""}
                    </span>
                  </div>
                </div>

                {/* Badges: Status (Today/Overdue) & Priority */}
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider border uppercase shadow-xs ${
                    isOverdue ? "bg-rose-50 text-rose-700 border-rose-200/80" : "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                  }`}>
                    {item.status || "Today"}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider border uppercase shadow-xs ${priorityStyle.bg} ${priorityStyle.text}`}>
                    {priorityStyle.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </article>
  );
}