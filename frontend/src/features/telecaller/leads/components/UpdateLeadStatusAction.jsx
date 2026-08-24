"use client";

import React, { useState } from "react";
import { ChevronRight, RefreshCw, ChevronDown, Check } from "lucide-react";
import { useTelecallerUpdateLeadStatus } from "@/features/telecaller/hooks/useTelecallerUpdateLeadStatus";

const TELECALLER_STAGES = ["ENQUIRY", "COLD", "WARM", "HOT", "COMPLETED"];
const STAGE_LABELS = {
  ENQUIRY: "Enquiry",
  COLD: "Cold Lead",
  WARM: "Warm Lead",
  HOT: "Hot Lead",
  COMPLETED: "Completed",
};

export default function UpdateLeadStatusAction({ enquiryNo, currentStatus }) {
  const { mutate: updateStatus, isPending } = useTelecallerUpdateLeadStatus();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [note, setNote] = useState("");

  const safeStatus = String(currentStatus || "").toUpperCase();
  const isNotInterested = safeStatus === "NOT_INTERESTED";

  const currentIndex = TELECALLER_STAGES.indexOf(safeStatus);
  const nextStage = currentIndex !== -1 && currentIndex < TELECALLER_STAGES.length - 1 
    ? TELECALLER_STAGES[currentIndex + 1] 
    : null;

  const handleUpdate = (targetStatus) => {
    updateStatus({ enquiryNo, status: targetStatus, note: note.trim() });
    setIsDropdownOpen(false);
    setNote("");
  };

  return (
    <div className="flex items-center gap-2 relative">
      {/* Visual Journey Stepper Mini */}
      <div className="hidden lg:flex items-center gap-1.5 mr-2 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl">
        {TELECALLER_STAGES.map((stage, idx) => {
          const isPassed = idx <= currentIndex && !isNotInterested;
          const isActive = idx === currentIndex && !isNotInterested;
          return (
            <React.Fragment key={stage}>
              <span className={`text-[10px] font-bold ${isActive ? "text-blue-700" : isPassed ? "text-slate-700" : "text-slate-400"}`}>
                {STAGE_LABELS[stage] || stage}
              </span>
              {idx < TELECALLER_STAGES.length - 1 && (
                <ChevronRight size={10} className={isPassed ? "text-slate-400" : "text-slate-300"} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {isNotInterested ? (
        <button
          disabled={isPending}
          onClick={() => handleUpdate("ENQUIRY")}
          className="h-10 px-4 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={14} />
          <span>Reopen Lead</span>
        </button>
      ) : nextStage ? (
        <div className="flex items-center">
          <button
            disabled={isPending}
            onClick={() => handleUpdate(nextStage)}
            className="h-10 px-4 rounded-l-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 border border-blue-600"
          >
            <span>Move to {STAGE_LABELS[nextStage] || nextStage}</span>
            {isPending ? <RefreshCw size={14} className="animate-spin" /> : <ChevronRight size={14} />}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="h-10 px-2 rounded-r-xl border-y border-r border-blue-700 bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center transition-all"
            >
              <ChevronDown size={14} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-12 w-64 bg-white border border-slate-200 shadow-xl rounded-xl z-50 p-2 font-outfit">
                <div className="mb-2 px-2 pt-1 pb-2 border-b border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Change Status</p>
                </div>
                
                <div className="max-h-48 overflow-y-auto mb-2 space-y-1">
                  {TELECALLER_STAGES.map(stage => (
                    <button
                      key={stage}
                      onClick={() => handleUpdate(stage)}
                      disabled={stage === safeStatus || isPending}
                      className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center justify-between transition-colors ${
                        stage === safeStatus 
                          ? "bg-slate-50 text-slate-400 cursor-not-allowed" 
                          : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      <span>{(STAGE_LABELS[stage] || stage).replace("_", " ")}</span>
                      {stage === safeStatus && <Check size={12} className="text-slate-400" />}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-2 px-1 pb-1">
                  <textarea 
                    placeholder="Add an optional note..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full text-[11px] p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none h-16"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <span className="h-10 px-4 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs flex items-center gap-2">
          <Check size={14} /> Journey Complete
        </span>
      )}
    </div>
  );
}
