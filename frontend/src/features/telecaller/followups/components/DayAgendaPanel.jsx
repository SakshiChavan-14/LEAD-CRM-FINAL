"use client";

import React from "react";
import DayAgendaItem from "./DayAgendaItem";
import EmptyFollowups from "./EmptyFollowups";
import Button from "@/components/ui/Button";
import { Plus, Calendar } from "lucide-react";

export default function DayAgendaPanel({ selectedDate, followups = [], onSchedule, onReschedule }) {
  const formattedDate = selectedDate 
    ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : "Select a date";

  return (
    <div className="flex flex-col h-full bg-slate-50/50 font-outfit rounded-2xl overflow-hidden">
      
      <div className="flex-none p-5 bg-white border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">{formattedDate}</h3>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {followups.length} follow-up{followups.length !== 1 ? 's' : ''} scheduled
          </p>
        </div>
        <span className="text-xs font-mono font-extrabold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200/80 shadow-2xs">
          {followups.length} Tasks
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {followups.length === 0 ? (
          <EmptyFollowups type="empty_day" />
        ) : (
          <div className="flex flex-col gap-3">
            {followups.map(f => (
              <DayAgendaItem key={f.id} followup={f} onReschedule={onReschedule} />
            ))}
          </div>
        )}
      </div>

      <div className="flex-none p-4 bg-white border-t border-slate-100">
        <button 
          onClick={() => onSchedule(selectedDate)}
          className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Plus size={15} /> 
          <span>Schedule Follow-up</span>
        </button>
      </div>
    </div>
  );
}
