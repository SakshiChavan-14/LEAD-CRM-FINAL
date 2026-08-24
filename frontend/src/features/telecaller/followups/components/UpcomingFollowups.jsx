"use client";

import React from "react";
import { CalendarClock, Clock, Calendar } from "lucide-react";
import CallButton from "@/features/telecaller/voice/components/CallButton";

import EmptyState from "@/components/ui/EmptyState";

export default function UpcomingFollowups({ isLoading, followups = [] }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col h-[360px] animate-pulse font-outfit">
        <div className="flex justify-between items-center mb-4">
          <div className="w-28 h-5 bg-slate-100 rounded" />
          <div className="w-16 h-5 bg-slate-100 rounded-full" />
        </div>
        <div className="space-y-3 flex-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const items = Array.isArray(followups) ? followups : [];

  if (!isLoading && items.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col h-[360px] justify-between font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-2xs">
              <CalendarClock size={16} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 leading-none">Upcoming Follow-ups</h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Scheduled student touchpoints</p>
            </div>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center mt-5">
          <EmptyState title="No upcoming follow-ups" description="No scheduled student touchpoints." />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col h-[360px] justify-between font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-2xs">
            <CalendarClock size={16} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 leading-none">Upcoming Follow-ups</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Scheduled student touchpoints</p>
          </div>
        </div>
        <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
          {items.length} Pending
        </span>
      </div>

      {/* List with Smooth Scrolling */}
      <div className="space-y-2.5 flex-1 overflow-y-auto pr-1 [scrollbar-width:none]">
        {items.map((item, idx) => {
          return (
            <div 
              key={`${item.id || item.enquiryNo || 'item'}-${idx}`} 
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-blue-200 hover:shadow-2xs transition-all duration-200 group gap-3"
            >
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                  {item.name || item.studentName || item.student || item.leadName || `Lead #${item.enquiryNo || item.id}`}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 border border-blue-200">
                    <Clock size={10} />
                    {item.time || item.scheduledTime || "Scheduled"}
                  </span>
                </div>
              </div>

              {/* Icon-Only White Call Button with #00C853 */}
              <div className="flex items-center gap-2 shrink-0">
                <CallButton
                  enquiryNo={item.enquiryNo || item.id}
                  name={item.name}
                  phone={item.phone}
                  iconOnly={true}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-[#00C853] shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                  iconSize={13}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
