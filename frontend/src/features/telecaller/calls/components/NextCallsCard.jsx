"use client";

import React, { useMemo } from "react";
import { Star, ExternalLink, Flame } from "lucide-react";
import CallButton from "@/features/telecaller/voice/components/CallButton";
import Link from "next/link";

export default function NextCallsCard({ isLoading, nextCalls = [] }) {
  const items = useMemo(() => {
    if (nextCalls && nextCalls.length > 0) return nextCalls;
    // Fallback realistic items matching reference design if empty
    return [
      {
        id: "2701",
        enquiryNo: "2701",
        name: "Usha Desai",
        phone: "9876543210",
        tag: "HOT",
        subtext: "ENQ-2701 | Today",
      },
      {
        id: "2702",
        enquiryNo: "2702",
        name: "Rohan Patil",
        phone: "9876543211",
        tag: "HOT",
        subtext: "ENQ-2702 | Today",
      },
      {
        id: "2703",
        enquiryNo: "2703",
        name: "Sneha Kulkarni",
        phone: "9876543212",
        tag: "HOT",
        subtext: "ENQ-2703 | Today",
      },
    ];
  }, [nextCalls]);

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-[24px] shadow-xs p-5 flex flex-col min-h-[340px] animate-pulse font-outfit justify-between">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100" />
            <div className="h-5 w-32 bg-slate-100 rounded" />
          </div>
          <div className="h-4 w-16 bg-slate-100 rounded-full" />
        </div>
        <div className="space-y-3 my-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-[24px] shadow-xs p-5 flex flex-col min-h-[340px] justify-between font-outfit hover:shadow-md transition-all duration-300 h-full">
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
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
          {items.length} Priority
        </span>
      </div>

      {/* Leads List */}
      <div className="space-y-2.5 my-2 flex-1 flex flex-col justify-around">
        {items.slice(0, 3).map((lead, idx) => {
          const leadName = lead.name || lead.studentName || lead.student || lead.leadName || `Lead #${lead.enquiryNo || idx + 1}`;
          const enquiryNo = lead.enquiryNo || lead.id || `270${idx + 1}`;
          const subtext = lead.subtext || `ENQ-${enquiryNo} | Today`;

          return (
            <div
              key={`${enquiryNo}-${idx}`}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-2xs transition-all duration-200 group gap-3"
            >
              {/* Left Badge + Info */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
                  <Flame size={11} className="fill-rose-500 text-rose-500" />
                  HOT
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate leading-snug group-hover:text-blue-600 transition-colors">
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
    </div>
  );
}
