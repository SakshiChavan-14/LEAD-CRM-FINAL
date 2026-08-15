"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function FollowupCalendarView({ 
  followups = [],
  selectedDate, 
  onSelectDate, 
  onSchedule, 
  onReschedule 
}) {
  const today = new Date();
  const [monthOffset, setMonthOffset] = useState(0);
  
  // Compute the displayed month based on offset
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Heatmap: only count non-completed follow-ups
  const heatmap = useMemo(() => {
    const map = {};
    followups.forEach(f => {
      const isCompleted = String(f.status || "").toLowerCase() === "completed";
      if (isCompleted) return;
      const d = f.scheduledDate;
      if (d) {
        map[d] = (map[d] || 0) + 1;
      }
    });
    return map;
  }, [followups]);

  // Generate grid days
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    const offset = d.getTimezoneOffset();
    const _d = new Date(d.getTime() - (offset*60*1000));
    calendarDays.push(_d.toISOString().split("T")[0]);
  }

  // Today string for highlighting
  const tOffset = today.getTimezoneOffset();
  const _t = new Date(today.getTime() - (tOffset*60*1000));
  const todayStr = _t.toISOString().split("T")[0];

  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col rounded-2xl w-full font-outfit">
      {/* Month header with navigation */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <button
          onClick={() => setMonthOffset(prev => prev - 1)}
          className="flex items-center justify-center w-8 h-8 rounded-xl hover:bg-slate-100 border border-slate-200/80 transition-all text-slate-600 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
          {monthLabel}
        </h2>
        <button
          onClick={() => setMonthOffset(prev => prev + 1)}
          className="flex items-center justify-center w-8 h-8 rounded-xl hover:bg-slate-100 border border-slate-200/80 transition-all text-slate-600 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {DAYS.map(day => (
          <div key={day} className="text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {calendarDays.map((dateStr, idx) => {
          if (!dateStr) return <div key={`empty-${idx}`} className="aspect-square"></div>;

          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === todayStr;
          const count = heatmap[dateStr] || 0;

          return (
            <button
              key={dateStr}
              onClick={() => {
                onSelectDate(dateStr);
                if (count === 0 && onSchedule) {
                  onSchedule(dateStr);
                }
              }}
              className={`relative flex flex-col items-center justify-between aspect-square p-1.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/30 shadow-xs scale-105 z-10' 
                  : isToday
                    ? 'border-blue-200 bg-blue-50/40 text-blue-700 font-extrabold hover:border-blue-300'
                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className={`text-xs font-bold ${isSelected ? 'text-blue-700 font-extrabold' : isToday ? 'text-blue-600' : 'text-slate-700'}`}>
                {parseInt(dateStr.split('-')[2], 10)}
              </span>

              {/* Event count dot indicator */}
              <div className="mt-auto flex items-center justify-center h-2">
                {count > 0 && (
                  <div className="flex items-center gap-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-xs animate-pulse" />
                    {count > 1 && (
                      <span className="text-[9px] font-mono font-bold text-blue-600 leading-none">
                        {count}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
