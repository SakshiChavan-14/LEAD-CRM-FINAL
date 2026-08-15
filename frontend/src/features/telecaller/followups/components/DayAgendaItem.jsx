"use client";

import { Clock, ExternalLink, RefreshCw, ChevronRight, BookOpen } from "lucide-react";
import React from "react";
import Link from "next/link";

const getPriorityBadge = (p) => {
  const val = (p || "").toLowerCase();
  if (val === "high") return "text-rose-700 bg-rose-50 border-rose-200";
  if (val === "medium") return "text-amber-700 bg-amber-50 border-amber-200";
  if (val === "low") return "text-blue-700 bg-blue-50 border-blue-200";
  return "text-slate-600 bg-slate-50 border-slate-200";
};

export default function DayAgendaItem({ followup, onReschedule }) {
  const {
    id,
    name,
    student,
    leadName,
    course,
    programme,
    priority,
    scheduledTime,
    time,
    enquiryNo,
    leadId
  } = followup;

  const displayName = name || student || leadName || "Student";
  const displayCourse = course || programme || "Computer Science";
  const displayTime = scheduledTime || time || "09:00 AM";
  const displayPriority = priority || "Medium";
  
  const leadUrl = `/telecaller/leads/${enquiryNo || leadId || id}`;

  return (
    <div className="flex flex-col bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 p-4 group font-outfit">
      
      <div className="flex flex-col mb-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="text-sm font-extrabold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
            {displayName}
          </h4>
          <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-2xs ${getPriorityBadge(displayPriority)}`}>
            {displayPriority}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs mt-0.5">
          <div className="flex items-center gap-1 text-slate-700 font-bold">
            <Clock size={12} className="text-blue-600" />
            <span>{displayTime}</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1 text-slate-600">
            <BookOpen size={12} className="text-slate-400" />
            <span className="truncate">{displayCourse}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-auto pt-2 border-t border-slate-100">
        <button 
          onClick={() => onReschedule(followup)}
          className="flex-1 flex items-center justify-center gap-1.5 h-8 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
        >
          <RefreshCw size={11} /> 
          <span>Reschedule</span>
        </button>
        <Link href={leadUrl} className="flex-1">
          <button className="w-full flex items-center justify-center gap-1.5 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95">
            <span>Open Lead</span> 
            <ChevronRight size={13} />
          </button>
        </Link>
      </div>
      
    </div>
  );
}
