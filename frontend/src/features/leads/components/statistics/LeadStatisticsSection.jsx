"use client";

import React from "react";
import { 
  PhoneCall, 
  PhoneForwarded, 
  CalendarClock, 
  PhoneMissed, 
  Sparkles, 
  UserCheck, 
  FileText, 
  Award 
} from "lucide-react";

import SharedLeadPipeline from "@/components/shared/SharedLeadPipeline";
import { useLeadCalls } from "@/features/telecaller/hooks/useLeadCalls";
import { useFollowups } from "@/features/telecaller/hooks/useFollowups";

export default function LeadStatisticsSection({ viewModel, rawData, isTelecaller = false }) {
  const enquiryNo = rawData?.lead?.enquiryNo || rawData?.enquiryNo || rawData?.id;
  const stage = (viewModel?.status?.currentStatus && viewModel.status.currentStatus !== "N/A")
    ? viewModel.status.currentStatus
    : (viewModel?.status?.stage && viewModel.status.stage !== "N/A")
      ? viewModel.status.stage
      : rawData?.status || "ENQUIRY";

  const { data: callsData } = useLeadCalls(enquiryNo);
  const calls = Array.isArray(callsData) && callsData.length > 0 ? callsData : (rawData?.calls || []);

  const { data: allFollowupsData } = useFollowups("all");
  const allFollowups = Array.isArray(allFollowupsData) ? allFollowupsData : [];
  const leadFollowups = allFollowups.length > 0 
    ? allFollowups.filter((f) => String(f.enquiryNo || f.leadId) === String(enquiryNo)) 
    : (rawData?.followups || []);

  const totalCalls = calls.length;
  const connectedCalls = calls.filter((c) => {
    const statusVal = String(c.status || c.outcome || c.interactionStatus || c.callOutcome || "").toUpperCase();
    return statusVal === "CONNECTED" || statusVal === "COMPLETED";
  }).length;
  const followupsCount = leadFollowups.length;
  const missedCalls = calls.filter((c) => {
    const statusVal = String(c.status || c.outcome || c.interactionStatus || c.callOutcome || "").toUpperCase();
    return statusVal === "MISSED" || statusVal === "NO_RESPONSE" || statusVal === "FAILED";
  }).length;

  return (
    <div className="space-y-6 font-outfit">
      {/* 4 Stats Cards Grid Top Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Calls */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 group">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <PhoneCall size={18} />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 leading-tight font-mono">{totalCalls}</span>
          <span className="text-xs font-semibold text-slate-400 mt-0.5">Total Calls</span>
        </div>

        {/* Connected Calls */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 group">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <PhoneForwarded size={18} />
          </div>
          <span className="text-2xl font-extrabold text-emerald-600 mt-1 leading-tight font-mono">{connectedCalls}</span>
          <span className="text-xs font-semibold text-slate-400 mt-0.5">Connected</span>
        </div>

        {/* Follow-ups */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 group">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <CalendarClock size={18} />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 leading-tight font-mono">{followupsCount}</span>
          <span className="text-xs font-semibold text-slate-400 mt-0.5">Follow-ups</span>
        </div>

        {/* Missed Calls */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 group">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <PhoneMissed size={18} />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 leading-tight font-mono">{missedCalls}</span>
          <span className="text-xs font-semibold text-slate-400 mt-0.5">Missed</span>
        </div>
      </div>

      {/* Row: Pipeline Card (Full width) */}
      <div className="w-full">
        <SharedLeadPipeline enquiryNo={enquiryNo} currentStatus={stage} />
      </div>
    </div>
  );
}
