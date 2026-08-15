"use client";

import { Clock, Phone, BookOpen, ChevronRight, RefreshCw, FileText, CheckCircle2, User } from "lucide-react";
import React from "react";
import Button from "@/components/ui/Button";
import Link from "next/link";

const getPriorityBadge = (p) => {
  const val = (p || "").toLowerCase();
  if (val === "high") return "text-rose-700 bg-rose-50 border-rose-200";
  if (val === "medium") return "text-amber-700 bg-amber-50 border-amber-200";
  if (val === "low") return "text-blue-700 bg-blue-50 border-blue-200";
  return "text-slate-600 bg-slate-50 border-slate-200";
};

export default function FollowupCard({ followup, onReschedule, onComplete }) {
  const {
    id,
    name,
    student,
    studentName,
    leadName,
    course,
    programme,
    phone,
    mobile,
    mobileNo,
    priority,
    scheduledDate,
    scheduledTime,
    remarks,
    notes,
    enquiryNo,
    leadId,
    status
  } = followup;

  const displayName = studentName || name || student || leadName || "Student";
  const displayPhone = mobileNo || phone || mobile || "9338495402";
  const displayCourse = course || programme || "Computer Science";
  const displayTime = scheduledTime || "09:00 AM";
  const isCompleted = String(status || "").toLowerCase() === "completed";
  
  const leadUrl = `/telecaller/leads/${enquiryNo || leadId || id}`;

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map(n => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "ST";

  return (
    <div className="flex flex-col sm:flex-row justify-between bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 p-5 gap-5 group w-full font-outfit">
      
      {/* Left: Avatar + Info Section */}
      <div className="flex-1 min-w-0 flex items-start gap-4">
        <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-800 border border-blue-100 flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0 mt-0.5">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Row 1: Lead Name & Time */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5 gap-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="text-base font-extrabold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                {displayName}
              </h3>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full shrink-0 border border-slate-200/60">
                #{enquiryNo || leadId || id}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-700 font-bold shrink-0 text-xs">
              <Clock size={14} className="text-blue-600" />
              <span>{displayTime}</span>
              <span className="text-slate-400 font-medium ml-0.5">• {scheduledDate}</span>
            </div>
          </div>
          
          {/* Row 2: Phone & Course */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-slate-600 mb-2.5">
            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-200/60 font-mono">
              <Phone size={12} className="text-slate-400" />
              {displayPhone}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-slate-700 font-bold">
              <BookOpen size={12} className="text-blue-500" />
              {displayCourse}
            </span>
          </div>

          {/* Row 3: Priority & Remarks */}
          <div className="flex flex-wrap items-center gap-2">
            {priority && (
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-2xs ${getPriorityBadge(priority)}`}>
                {priority} Priority
              </span>
            )}

            {isCompleted && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs">
                Completed
              </span>
            )}
          </div>

          {(notes || remarks) && (
            <div className="flex items-start gap-2 bg-slate-50/70 border border-slate-200/60 rounded-xl p-2.5 text-xs text-slate-600 mt-2.5 w-full">
              <FileText size={13} className="text-slate-400 mt-0.5 shrink-0" />
              <span className="line-clamp-1 font-medium">{notes || remarks}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right/Bottom: Actions */}
      <div className="flex sm:flex-col justify-end items-stretch sm:items-end gap-2 shrink-0 sm:border-l border-slate-100 sm:pl-5 pt-3 sm:pt-0 border-t sm:border-t-0">
        <Link href={leadUrl} className="w-full sm:w-auto">
          <button className="w-full sm:w-auto px-4 h-9 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200/80 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5">
            <span>Open Lead</span>
            <ChevronRight size={14} />
          </button>
        </Link>

        {!isCompleted && (
          <button 
            onClick={() => onReschedule(followup)}
            className="w-full sm:w-auto px-3.5 h-9 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
          >
            <RefreshCw size={12} />
            <span>Reschedule</span>
          </button>
        )}

        {!isCompleted && (
          <button 
            onClick={() => onComplete(followup)}
            className="w-full sm:w-auto px-3.5 h-9 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100 rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
          >
            <CheckCircle2 size={13} />
            <span>Mark Complete</span>
          </button>
        )}
      </div>

    </div>
  );
}
