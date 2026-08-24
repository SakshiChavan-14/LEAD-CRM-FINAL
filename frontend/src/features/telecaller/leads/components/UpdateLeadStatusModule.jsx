"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Sparkles, ArrowRight, CheckCircle2, ChevronDown, MessageSquare, XCircle, AlertCircle } from "lucide-react";
import { LEAD_STAGES } from "@/features/leads/constants/leadStages";
import { useTelecallerUpdateLeadStatus } from "@/features/telecaller/hooks/useTelecallerUpdateLeadStatus";
import { useUpdateLeadStatus } from "@/features/leads/hooks/useUpdateLeadStatus";
import { useLeadStatusHistory } from "@/features/leads/hooks/useLeadStatusHistory";
import { formatDisplayDate } from "@/utils/dateUtils";

const STAGE_LABELS = {
  ENQUIRY: "New Lead",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  APPLICATION: "Application",
  ADMISSION: "Admission",
  NOT_INTERESTED: "Not Interested",
};

const NEXT_STAGE_MAP = {
  ENQUIRY: "CONTACTED",
  CONTACTED: "QUALIFIED",
  QUALIFIED: "APPLICATION",
  APPLICATION: "ADMISSION",
  ADMISSION: null,
};

const TELECALLER_STAGE_LABELS = {
  ENQUIRY: "New Lead",
  COLD: "Cold Lead",
  WARM: "Warm Lead",
  HOT: "Hot Lead",
  COMPLETED: "Completed",
};

const TELECALLER_NEXT_STAGE_MAP = {
  ENQUIRY: "COLD",
  COLD: "WARM",
  WARM: "HOT",
  HOT: "COMPLETED",
  COMPLETED: null,
};

const TELECALLER_STAGES = ["ENQUIRY", "COLD", "WARM", "HOT", "COMPLETED"];


export default function UpdateLeadStatusModule({ enquiryNo, currentStatus, isTelecaller = false }) {
  const safeCurrent = String(currentStatus || "ENQUIRY").toUpperCase();
  
  const stages = isTelecaller ? TELECALLER_STAGES : LEAD_STAGES;
  const stageLabels = isTelecaller ? TELECALLER_STAGE_LABELS : STAGE_LABELS;
  const nextStageMap = isTelecaller ? TELECALLER_NEXT_STAGE_MAP : NEXT_STAGE_MAP;
  
  const nextStage = nextStageMap[safeCurrent] || null;
  
  const initialStatus = stages.includes(safeCurrent)
    ? (nextStage || safeCurrent)
    : (stages[0] || "ENQUIRY");
  
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [note, setNote] = useState("");
 
  const telecallerMutation = useTelecallerUpdateLeadStatus();
  const adminMutation = useUpdateLeadStatus();
 
  const mutation = isTelecaller ? telecallerMutation : adminMutation;
  const { mutateAsync: updateStatus, isPending } = mutation;
 
  const { data: history = [] } = useLeadStatusHistory(enquiryNo);
 
  // Update default selected status whenever currentStatus changes
  useEffect(() => {
    const next = nextStageMap[safeCurrent] || null;
    const initial = stages.includes(safeCurrent)
      ? (next || safeCurrent)
      : (stages[0] || "ENQUIRY");
    setSelectedStatus(initial);
  }, [safeCurrent, isTelecaller]);
 
  const handleUpdate = async (statusToSubmit) => {
    if (!statusToSubmit) return;
 
    try {
      await updateStatus({
        enquiryNo,
        status: statusToSubmit,
        note: note.trim() || undefined,
      });
      setNote("");
    } catch (err) {
      console.error("Failed to update lead status:", err);
    }
  };
 
  // Get status since timestamp
  const statusSinceStr = useMemo(() => {
    const recentHistory = Array.isArray(history) ? history : [];
    const latest = recentHistory.find(h => String(h.newStatus || h.status).toUpperCase() === safeCurrent);
    if (latest) {
      const dateStr = formatDisplayDate(latest.changedAt || latest.createdAt || latest.timestamp);
      const timeStr = (latest.changedAt || latest.createdAt || latest.timestamp)
        ? new Date(latest.changedAt || latest.createdAt || latest.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : "";
      return `Since ${dateStr} ${timeStr}`;
    }
    return "Since just now";
  }, [history, safeCurrent]);
 
  // Status badge style
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "ADMISSION":
      case "COMPLETED":
        return "bg-purple-50 text-purple-700 border-purple-200/80";
      case "QUALIFIED":
      case "INTERESTED":
      case "HOT":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "CONTACTED":
      case "WARM":
        return "bg-blue-50 text-blue-700 border-blue-200/80";
      case "NOT_INTERESTED":
      case "COLD":
        return "bg-rose-50 text-rose-700 border-rose-200/80";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-sm font-outfit hover:shadow-md transition-shadow duration-300 w-full flex flex-col justify-between overflow-hidden">
      {/* Title */}
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100 shrink-0">
        <span className="material-symbols-outlined text-[20px] text-blue-600">published_with_changes</span>
        <div>
          <h3 className="text-base font-extrabold text-slate-900 leading-none">Update Lead Status</h3>
          <p className="text-xs text-slate-400 mt-0.5">Move this lead forward in the admission journey</p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch mt-5">
        {/* Segment 1: Current Status Card */}
        <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 flex flex-col justify-between hover:bg-white hover:border-blue-100 hover:shadow-2xs transition-all duration-300">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Current Status</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider border uppercase ${getStatusBadgeClass(safeCurrent)}`}>
                {safeCurrent}
              </span>
            </div>
            <h4 className="text-xl font-black text-slate-800 mt-3 leading-tight">{stageLabels[safeCurrent] || safeCurrent}</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">{statusSinceStr}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 mt-4 shrink-0">
            <CheckCircle2 size={16} />
          </div>
        </div>

        {/* Segment 2: Quick Actions */}
        <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 flex flex-col justify-center gap-3.5 hover:bg-white hover:border-blue-100 hover:shadow-2xs transition-all duration-300">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block leading-none">Quick Actions</span>
          <div className="flex flex-col gap-2.5">
            {nextStage ? (
              <button
                type="button"
                onClick={() => handleUpdate(nextStage)}
                disabled={isPending}
                className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 size={13} />
                <span>Move to {stageLabels[nextStage]}</span>
              </button>
            ) : (
              <div className="py-2.5 px-3 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl text-xs font-bold text-center">
                Completed
              </div>
            )}
            
            {!isTelecaller && (
              <button
                type="button"
                onClick={() => handleUpdate("NOT_INTERESTED")}
                disabled={isPending || safeCurrent === "NOT_INTERESTED"}
                className="w-full py-2.5 px-4 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <XCircle size={13} />
                <span>Not Interested</span>
              </button>
            )}
          </div>
        </div>

        {/* Segment 3: Custom Status dropdown & Note textarea */}
        <div className="md:col-span-1 flex flex-col gap-3">
          <div className="relative">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Change Status</label>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 appearance-none outline-none focus:border-blue-500 focus:bg-white transition-colors cursor-pointer"
              >
                {stages.map((stg) => (
                  <option key={stg} value={stg}>
                    {stageLabels[stg] || stg}
                  </option>
                ))}
                {!isTelecaller && <option value="NOT_INTERESTED">Not Interested</option>}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add note (Optional)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none h-[64px]"
            />
          </div>

          <button
            type="button"
            onClick={() => handleUpdate(selectedStatus)}
            disabled={isPending || selectedStatus === safeCurrent}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-3xs"
          >
            {isPending ? "Updating..." : "Update Status"}
          </button>
        </div>

        {/* Segment 4: Tips checklist */}
        <div className="bg-blue-50/40 rounded-2xl border border-blue-100/50 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-blue-700">
              <AlertCircle size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Tips</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-600 font-semibold leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>Add a note for better tracking</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>Update only when interaction happens</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>Right status update improves conversion</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
