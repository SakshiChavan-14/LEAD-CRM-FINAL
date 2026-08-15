"use client";

import React, { useMemo } from "react";
import { Filter, Sparkles, PhoneCall, UserCheck, FileText, Award } from "lucide-react";
import { LEAD_STAGES } from "@/features/leads/constants/leadStages";
import { useLeadStatusHistory } from "@/features/leads/hooks/useLeadStatusHistory";
import { formatDisplayDate } from "@/utils/dateUtils";

const DashedConnector = ({ isActive }) => (
  <div className="flex-grow flex items-center justify-center min-w-[8px] md:min-w-[20px] mx-0.5 md:mx-1">
    <div className={`w-full border-t-2 border-dashed ${isActive ? "border-emerald-500" : "border-slate-200"} relative`}>
      <div 
        className={`absolute -right-0.5 -top-[5px] w-2 h-2 border-r-2 border-b-2 transform rotate-[-45deg] ${
          isActive ? "border-emerald-500" : "border-slate-300"
        }`} 
      />
    </div>
  </div>
);

export default function SharedLeadPipeline({ enquiryNo, currentStatus }) {
  const { data: history = [] } = useLeadStatusHistory(enquiryNo);

  const stages = useMemo(() => {
    return [
      { key: "ENQUIRY", label: "New Lead", color: "border-blue-500 text-blue-600 bg-blue-50/50", activeColor: "bg-blue-500 text-white border-blue-500", icon: Sparkles, desc: "Lead created" },
      { key: "CONTACTED", label: "Contacted", color: "border-cyan-500 text-cyan-600 bg-cyan-50/50", activeColor: "bg-cyan-500 text-white border-cyan-500", icon: PhoneCall, desc: "First touch" },
      { key: "QUALIFIED", label: "Qualified", color: "border-emerald-500 text-emerald-600 bg-emerald-50/50", activeColor: "bg-emerald-500 text-white border-emerald-500", icon: UserCheck, desc: "Interested" },
      { key: "APPLICATION", label: "Application", color: "border-amber-500 text-amber-600 bg-amber-50/50", activeColor: "bg-amber-500 text-white border-amber-500", icon: FileText, desc: "Form filled" },
      { key: "ADMISSION", label: "Admission", color: "border-purple-500 text-purple-600 bg-purple-50/50", activeColor: "bg-purple-500 text-white border-purple-500", icon: Award, desc: "Enrolled" }
    ];
  }, []);

  const safeStatus = String(currentStatus || "").toUpperCase();
  const isNotInterested = safeStatus === "NOT_INTERESTED";

  let currentStageIndex = LEAD_STAGES.indexOf(safeStatus);
  if (currentStageIndex === -1) {
    if (isNotInterested) {
      // Find the last stage they were in before NOT_INTERESTED, or default to ENQUIRY
      const lastHistoryStatus = history.reverse().find(h => LEAD_STAGES.includes(h.newStatus || h.status));
      currentStageIndex = lastHistoryStatus ? LEAD_STAGES.indexOf(lastHistoryStatus.newStatus || lastHistoryStatus.status) : 0;
    } else {
      currentStageIndex = 0; // default to new lead if unknown
    }
  }

  const progressPercentage = isNotInterested 
    ? 0 
    : Math.round(((currentStageIndex + 1) / LEAD_STAGES.length) * 100);

  return (
    <div className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-xs h-full flex flex-col justify-between font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/60">
            <Filter size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Lead Pipeline Progression</h3>
            <p className="text-xs text-slate-400">Admission conversion journey</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-bold">Current Stage:</span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase shadow-3xs tracking-wider ${
            isNotInterested 
              ? "bg-rose-50 text-rose-700 border-rose-200/80" 
              : "bg-blue-50 text-blue-700 border-blue-200/80"
          }`}>
            {isNotInterested ? "NOT INTERESTED" : safeStatus}
          </span>
        </div>
      </div>

      {/* Pipeline Stage Progression Nodes */}
      <div className="flex items-center justify-between w-full py-6 mt-4 flex-grow relative">
        {stages.map((s, index) => {
          // If not interested, show it stopped at currentStageIndex
          const isActive = index === currentStageIndex && !isNotInterested;
          const isFailedHere = index === currentStageIndex && isNotInterested;
          const isCompleted = index <= currentStageIndex && !isFailedHere;
          const IconComponent = s.icon;

          // Find timestamp from history
          const stageHistory = history.find(h => (h.newStatus || h.status) === s.key);
          const timeLabel = stageHistory ? formatDisplayDate(stageHistory.changedAt || stageHistory.createdAt) : null;

          return (
            <React.Fragment key={s.key}>
              {/* Stage Node */}
              <div className="flex flex-col items-center gap-2 flex-1 max-w-[120px] group cursor-pointer relative z-10">
                <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center shadow-xs transition-all duration-300 ${
                  isActive 
                    ? "border-blue-600 text-blue-600 bg-white scale-110 shadow-md ring-4 ring-blue-100 font-bold" 
                    : isFailedHere
                      ? "border-rose-500 text-white bg-rose-500 scale-110 shadow-md ring-4 ring-rose-100"
                      : isCompleted 
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-xs" 
                        : "border-slate-200 text-slate-400 bg-slate-50/80"
                }`}>
                  <IconComponent size={18} />
                </div>
                <div className="text-center">
                  <p className={`text-[11px] font-bold tracking-tight leading-none ${isActive || isFailedHere ? "text-slate-900 font-extrabold" : "text-slate-500"}`}>
                    {s.label}
                  </p>
                  <p className="text-[9px] text-slate-400 font-medium mt-0.5 hidden md:block">
                    {timeLabel || s.desc}
                  </p>
                </div>
              </div>

              {/* Dashed Connecting Line */}
              {index < stages.length - 1 && (
                <DashedConnector isActive={index < currentStageIndex && !isFailedHere} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
