"use client";

import React, { useMemo } from "react";
import { Calendar } from "lucide-react";
import CallButton from "@/features/telecaller/voice/components/CallButton";

export default function UpcomingFollowups({ isLoading, followups = [] }) {
  const items = useMemo(() => {
    return Array.isArray(followups) ? followups : [];
  }, [followups]);

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-[24px] shadow-xs p-5 flex flex-col font-outfit h-full animate-pulse">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100" />
            <div className="h-5 w-36 bg-slate-100 rounded" />
          </div>
          <div className="h-4 w-16 bg-slate-100 rounded-full" />
        </div>
        <div className="pt-3.5 space-y-2.5 flex-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-[24px] shadow-xs p-5 flex flex-col font-outfit hover:shadow-md transition-all duration-300 h-full">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/70 shrink-0">
            <Calendar size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">Upcoming Follow-ups</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Scheduled student touchpoints</p>
          </div>
        </div>
        {items.length > 0 && (
          <span className="text-xs font-semibold text-purple-600 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-full">
            {items.length} Pending
          </span>
        )}
      </div>

      {/* Follow-ups List or Empty State */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mb-2 shadow-2xs">
            <Calendar size={18} />
          </div>
          <p className="text-xs font-bold text-slate-700">No upcoming follow-ups</p>
          <p className="text-[11px] text-slate-400 mt-0.5">All scheduled touchpoints have been handled.</p>
        </div>
      ) : (
        <div className="pt-3.5 space-y-2.5 flex-1 overflow-y-auto [scrollbar-width:none]">
          {items.slice(0, 5).map((item, idx) => {
            const leadName = item.name || item.studentName || item.student || item.leadName || `Lead #${item.enquiryNo || idx + 1}`;
            const enquiryNo = item.enquiryNo || item.id || `270${idx + 4}`;
            const scheduledText = item.scheduledTime || item.time || "Today";

            return (
              <div
                key={`${enquiryNo}-${idx}`}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-2xs transition-all duration-200 group gap-3"
              >
                {/* Left Badge + Info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                    <Calendar size={11} className="text-blue-500" />
                    Scheduled
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate leading-snug group-hover:text-blue-600 transition-colors">
                      {leadName}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                      {scheduledText}
                    </p>
                  </div>
                </div>

                {/* Right Call Button */}
                <div className="flex items-center shrink-0">
                  <CallButton
                    enquiryNo={enquiryNo}
                    name={leadName}
                    phone={item.phone}
                    iconOnly={true}
                    className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100/60 shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                    iconSize={13}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
