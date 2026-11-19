"use client";

import React, { useMemo } from "react";
import { Star, ExternalLink, Flame } from "lucide-react";
import CallButton from "@/features/telecaller/voice/components/CallButton";
import Link from "next/link";

export default function NextCallsCard({ isLoading, nextCalls = [] }) {
  const items = useMemo(() => {
    return Array.isArray(nextCalls) ? nextCalls : [];
  }, [nextCalls]);

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-[24px] shadow-xs p-5 flex flex-col font-outfit h-full animate-pulse">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100" />
            <div className="h-5 w-32 bg-slate-100 rounded" />
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
            <Star size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">Next Best Leads</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Top conversion readiness</p>
          </div>
        </div>
        {items.length > 0 && (
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
            {items.length} Priority
          </span>
        )}
      </div>

      {/* Leads List or Empty State */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mb-2 shadow-2xs">
            <Star size={18} />
          </div>
          <p className="text-xs font-bold text-slate-700">No priority leads</p>
          <p className="text-[11px] text-slate-400 mt-0.5">All scheduled calls for today have been completed.</p>
        </div>
      ) : (
        <div className="pt-3.5 space-y-2.5 flex-1 overflow-y-auto [scrollbar-width:none]">
          {items.slice(0, 5).map((lead, idx) => {
            const leadName = lead.name || lead.studentName || lead.student || lead.leadName || `Lead #${lead.enquiryNo || idx + 1}`;
            const enquiryNo = lead.enquiryNo || lead.id || `270${idx + 1}`;
            
            // Build informative Enquiry ID and follow-up subtitle
            const followupInfo = lead.followupTime || lead.scheduledTime || lead.time;
            const subtext = followupInfo 
              ? `ENQ-${enquiryNo} • Follow-up: ${followupInfo}`
              : (lead.subtext || `ENQ-${enquiryNo} • Today`);

            return (
              <div
                key={`${enquiryNo}-${idx}`}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-2xs transition-all duration-200 group gap-3"
              >
                {/* Left Temperature Badge + Lead Info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
                    <Flame size={11} className="fill-rose-500 text-rose-500" />
                    {lead.tag || lead.priority || "HOT"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate leading-snug group-hover:text-blue-600 transition-colors">
                      {leadName}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                      {subtext}
                    </p>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <CallButton
                    enquiryNo={enquiryNo}
                    name={leadName}
                    phone={lead.phone}
                    iconOnly={true}
                    className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100/60 shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                    iconSize={13}
                  />
                  <Link href={`/telecaller/leads/${enquiryNo}`}>
                    <button
                      type="button"
                      title="View Lead Details"
                      className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95"
                    >
                      <ExternalLink size={13} />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
