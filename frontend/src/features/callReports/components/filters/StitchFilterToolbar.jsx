"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, X, Check, Mic, PhoneIncoming, PhoneOutgoing, RotateCcw } from "lucide-react";

export default function StitchFilterToolbar({ filters, onFilterChange, onApplyFilters, isLoading }) {
  const [localSearch, setLocalSearch] = useState(filters?.search || "");
  const [localDateFrom, setLocalDateFrom] = useState(filters?.dateFrom || "");
  const [localDateTo, setLocalDateTo] = useState(filters?.dateTo || "");
  const [status, setStatus] = useState(filters?.status || "");
  const [direction, setDirection] = useState(filters?.direction || "");
  const [hasRecording, setHasRecording] = useState(filters?.hasRecording || "");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    setLocalSearch(filters?.search || "");
    setLocalDateFrom(filters?.dateFrom || "");
    setLocalDateTo(filters?.dateTo || "");
    setStatus(filters?.status || "");
    setDirection(filters?.direction || "");
    setHasRecording(filters?.hasRecording || "");
  }, [filters]);

  const handlePresetDate = (type) => {
    const today = new Date();
    const formatDateStr = (d) => d.toISOString().split("T")[0];

    if (type === "today") {
      const todayStr = formatDateStr(today);
      setLocalDateFrom(todayStr);
      setLocalDateTo(todayStr);
    } else if (type === "yesterday") {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yStr = formatDateStr(y);
      setLocalDateFrom(yStr);
      setLocalDateTo(yStr);
    } else if (type === "week") {
      const first = new Date(today.setDate(today.getDate() - today.getDay() + 1));
      const last = new Date();
      setLocalDateFrom(formatDateStr(first));
      setLocalDateTo(formatDateStr(last));
    } else if (type === "month") {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      const last = new Date();
      setLocalDateFrom(formatDateStr(first));
      setLocalDateTo(formatDateStr(last));
    }
  };

  const handleApply = () => {
    if (localDateFrom && localDateTo) {
      if (new Date(localDateFrom) > new Date(localDateTo)) {
        alert("From Date cannot be later than To Date.");
        return;
      }
    }

    onFilterChange(prev => ({
      ...prev,
      search: localSearch,
      dateFrom: localDateFrom,
      dateTo: localDateTo,
      status: status,
      direction: direction,
      hasRecording: hasRecording,
    }));

    if (onApplyFilters) onApplyFilters();
    setIsFilterDrawerOpen(false);
  };

  const handleReset = () => {
    setLocalSearch("");
    setLocalDateFrom("");
    setLocalDateTo("");
    setStatus("");
    setDirection("");
    setHasRecording("");

    onFilterChange(() => ({
      search: "",
      dateFrom: "",
      dateTo: "",
      status: "",
      direction: "",
      hasRecording: "",
    }));
    setIsFilterDrawerOpen(false);
  };

  const activeFilterCount = [
    status,
    direction,
    hasRecording,
    localDateFrom,
    localDateTo
  ].filter(Boolean).length;

  return (
    <div className="relative font-outfit">
      <section className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Search */}
        <div className="flex-1 min-w-[260px] max-w-md relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full h-11 pl-10 pr-4 bg-slate-50/70 border border-slate-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-semibold text-slate-900 placeholder:text-slate-400 transition-all outline-none"
            placeholder="Search by Lead name, Mobile, or Call ID..."
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleApply(); }}
          />
        </div>

        {/* Date Controls & Preset Quick Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Date Presets */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 text-[11px] font-bold text-slate-600">
            <button
              onClick={() => handlePresetDate("today")}
              className="px-2.5 py-1 rounded-lg hover:bg-white hover:text-blue-600 hover:shadow-2xs transition-all cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={() => handlePresetDate("yesterday")}
              className="px-2.5 py-1 rounded-lg hover:bg-white hover:text-blue-600 hover:shadow-2xs transition-all cursor-pointer"
            >
              Yesterday
            </button>
            <button
              onClick={() => handlePresetDate("week")}
              className="px-2.5 py-1 rounded-lg hover:bg-white hover:text-blue-600 hover:shadow-2xs transition-all cursor-pointer"
            >
              This Week
            </button>
          </div>

          {/* From - To Date Inputs */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1 text-xs">
            <Calendar size={14} className="text-slate-400 shrink-0" />
            <input
              type="date"
              className="bg-transparent text-xs font-bold text-slate-800 outline-none w-28 cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70"
              value={localDateFrom}
              onChange={(e) => setLocalDateFrom(e.target.value)}
              title="From Date"
            />
            <span className="text-slate-300 font-bold">—</span>
            <input
              type="date"
              className="bg-transparent text-xs font-bold text-slate-800 outline-none w-28 cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70"
              value={localDateTo}
              onChange={(e) => setLocalDateTo(e.target.value)}
              title="To Date"
            />
          </div>

          {/* More Filters Toggle */}
          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className={`relative flex items-center gap-1.5 px-3.5 h-11 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 shadow-2xs ${
              isFilterDrawerOpen || activeFilterCount > 0
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Filter size={14} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Apply Filters Button (Electric Blue / Indigo - NO MAROON) */}
          <button
            onClick={handleApply}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Check size={14} />
            <span>{isLoading ? "Applying..." : "Apply Filters"}</span>
          </button>
        </div>
      </section>

      {/* Right-Side Detailed Filters Modal / Dropdown Panel */}
      {isFilterDrawerOpen && (
        <div className="absolute right-0 top-full mt-2 w-full sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl p-5 z-50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900">Call Log Filters</h4>
            </div>
            <button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Call Outcome / Status */}
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Call Outcome
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              {["", "CONNECTED", "MISSED", "INTERESTED", "CALLBACK", "BUSY"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-2 rounded-xl text-left border transition-all cursor-pointer ${
                    status === s
                      ? "bg-blue-50 border-blue-300 text-blue-700 shadow-2xs"
                      : "bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {s === "" ? "All Outcomes" : s}
                </button>
              ))}
            </div>
          </div>

          {/* Call Direction */}
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Call Direction
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              {[
                { id: "", label: "All" },
                { id: "OUTBOUND", label: "Outbound" },
                { id: "INBOUND", label: "Inbound" },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDirection(d.id)}
                  className={`px-2.5 py-2 rounded-xl text-center border transition-all cursor-pointer ${
                    direction === d.id
                      ? "bg-blue-50 border-blue-300 text-blue-700 shadow-2xs"
                      : "bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recording Filter */}
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Recording Available
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              {[
                { id: "", label: "All" },
                { id: "true", label: "With Audio" },
                { id: "false", label: "No Audio" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setHasRecording(r.id)}
                  className={`px-2.5 py-2 rounded-xl text-center border transition-all cursor-pointer ${
                    hasRecording === r.id
                      ? "bg-purple-50 border-purple-300 text-purple-700 shadow-2xs"
                      : "bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset All</span>
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
            >
              Apply Filter Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
