"use client";

import React from "react";
import { Star, Clock, ExternalLink, Flame } from "lucide-react";
import CallButton from "@/features/telecaller/voice/components/CallButton";
import Link from "next/link";

import EmptyState from "@/components/ui/EmptyState";

export default function NextCallsCard({ isLoading, nextCalls = [], onLogCall }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col h-[360px] animate-pulse font-outfit">
        <div className="flex justify-between items-center mb-4">
          <div className="w-32 h-5 bg-slate-100 rounded" />
          <div className="w-16 h-5 bg-slate-100 rounded-full" />
        </div>
        <div className="space-y-3 flex-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-50 rounded-xl border border-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  const leads = nextCalls || [];

  if (!isLoading && leads.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col h-[360px] justify-between font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-2xs">
              <Star size={16} className="fill-blue-500 text-blue-500" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 leading-none">Next Best Leads</h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Top conversion readiness</p>
            </div>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center mt-5">
          <EmptyState title="No leads in queue" description="You have no calls scheduled for today." />
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
            <Star size={16} className="fill-blue-500 text-blue-500" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 leading-none">Next Best Leads</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Top conversion readiness</p>
          </div>
        </div>
        <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
          {leads.length} Priority
        </span>
      </div>
      
      {/* Leads List */}
      <div className="space-y-2.5 flex-1 overflow-y-auto pr-1 [scrollbar-width:none]">
        {leads.map((call) => (
          <div 
            key={call.id || call.enquiryNo} 
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-blue-200 hover:shadow-2xs transition-all duration-200 group gap-3"
          >
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {call.name}
                </span>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-50 text-blue-600 border border-blue-200">
                  <Flame size={9} />
                  {call.priority || "HOT"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
                <span className="truncate text-slate-600 font-semibold">{call.course || "B.Tech"}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400 font-mono">
                  <Clock size={11} /> {call.time || "Today"}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <CallButton
                enquiryNo={call.enquiryNo || call.id}
                name={call.name}
                phone={call.phone}
                iconOnly={true}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-[#00C853] shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                iconSize={13}
              />
              <Link href={`/telecaller/leads/${call.enquiryNo || call.id}`}>
                <button className="h-8 w-8 rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95">
                  <ExternalLink size={13} />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
