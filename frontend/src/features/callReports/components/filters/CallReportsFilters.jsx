"use client";

import React from "react";
import { Search, Calendar } from "lucide-react";

export default function CallReportsFilters({ 
  search, 
  onSearchChange, 
  selectedDate, 
  onDateChange 
}) {
  return (
    <section className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs mb-6 flex flex-wrap items-center justify-between gap-4 font-outfit">
      {/* Search Input */}
      <div className="flex-1 min-w-[280px] max-w-md relative">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full h-11 pl-10 pr-4 bg-slate-50/70 border border-slate-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-semibold text-slate-900 placeholder:text-slate-400 transition-all outline-none"
          placeholder="Search by Telecaller name or EMP ID..."
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Date Filter */}
      <div className="flex items-center gap-2">
        <div className="relative flex items-center bg-slate-50/70 border border-slate-200/80 rounded-xl px-3 py-1.5 h-11 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          <Calendar size={15} className="text-slate-400 mr-2 shrink-0" />
          <input
            className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70"
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
