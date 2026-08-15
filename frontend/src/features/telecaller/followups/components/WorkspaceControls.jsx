"use client";

import { Search, Filter, CalendarDays, ChevronDown, List, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import FollowupTabs from "@/features/telecaller/followups/components/FollowupTabs";

const DateRangeDropdown = ({ datePreset, setDatePreset, dateRange, setDateRange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFrom, setLocalFrom] = useState(dateRange?.from || "");
  const [localTo, setLocalTo] = useState(dateRange?.to || "");
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApplyCustom = () => {
    setDateRange({ from: localFrom, to: localTo });
    setDatePreset("custom");
    setIsOpen(false);
  };

  const handleReset = () => {
    setDatePreset("all");
    setDateRange({ from: "", to: "" });
    setLocalFrom("");
    setLocalTo("");
    setIsOpen(false);
  };

  const getLabel = () => {
    if (datePreset === "all") return "All Dates";
    if (datePreset === "custom") {
      if (dateRange?.from && dateRange?.to) return `${dateRange.from} - ${dateRange.to}`;
      return "Custom Range";
    }
    return datePreset.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="relative font-outfit" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-w-[140px] h-10 px-3.5 bg-white border border-slate-200/90 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
      >
        <span className="truncate">{getLabel()}</span>
        <ChevronDown size={14} className="text-slate-400 shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden transform origin-top-right transition-all p-2 flex flex-col gap-0.5">
          <h4 className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Select Date Preset</h4>
          
          <div className="h-px bg-slate-100 my-1"></div>
          
          {["all", "today", "tomorrow", "this_week", "next_week", "this_month"].map(preset => (
            <button
              key={preset}
              onClick={() => {
                setDatePreset(preset);
                setIsOpen(false);
              }}
              className={`flex items-center px-3 py-2 text-xs font-bold rounded-xl text-left transition-colors cursor-pointer ${
                datePreset === preset ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full border mr-2.5 flex items-center justify-center transition-colors ${datePreset === preset ? 'border-blue-600' : 'border-slate-300'}`}>
                {datePreset === preset && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </div>
              {preset === "all" ? "All Dates" : preset.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
          
          <div className="h-px bg-slate-100 my-1"></div>

          <div className="px-3 py-2">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Custom Range</h4>
            <div className="flex flex-col gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">From</label>
                <input 
                  type="date" 
                  value={localFrom}
                  onChange={e => setLocalFrom(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono font-medium" 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">To</label>
                <input 
                  type="date" 
                  value={localTo}
                  onChange={e => setLocalTo(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono font-medium" 
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-1"></div>

          <div className="p-2 flex items-center gap-2">
            <button 
              onClick={handleReset}
              className="flex-1 h-8 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Reset
            </button>
            <button 
              onClick={handleApplyCustom}
              className="flex-1 h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs cursor-pointer active:scale-95"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function WorkspaceControls({ workspace, onOpenFilters }) {
  const showSearch = true;

  // Determine if any filter is active
  const hasActiveFilters = 
    workspace.searchText ||
    workspace.datePreset !== "all" ||
    workspace.filters.priority ||
    workspace.filters.course ||
    workspace.filters.status ||
    workspace.filters.source ||
    workspace.filters.assignedCounselor ||
    workspace.filters.date;

  const handleResetAll = () => {
    workspace.setSearchText("");
    workspace.setDatePreset("all");
    workspace.setDateRange({ from: null, to: null });
    workspace.setFilters({
      priority: "",
      course: "",
      status: "",
      source: "",
      assignedCounselor: "",
      date: "",
    });
  };

  return (
    <div className="w-full space-y-3 font-outfit">
      {/* Row 1: Tabs (when in list mode) */}
      {workspace.viewMode !== "calendar" && (
        <div className="overflow-x-auto pb-1">
          <FollowupTabs 
            activeTab={workspace.activeTab}
            onTabChange={workspace.setActiveTab}
            tabCounts={workspace.tabCounts}
          />
        </div>
      )}

      {/* Row 2: Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full">
        
        {/* Left Side: Search Bar */}
        <div className="relative min-w-[220px] flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search follow-ups by student, phone..."
            value={workspace.searchText}
            onChange={(e) => workspace.setSearchText(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/90 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 h-10 shadow-2xs hover:border-slate-300"
          />
        </div>

        {/* Right Side: Filters, Date Dropdown, View Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <DateRangeDropdown 
            datePreset={workspace.datePreset}
            setDatePreset={workspace.setDatePreset}
            dateRange={workspace.dateRange}
            setDateRange={workspace.setDateRange}
          />

          <button 
            onClick={onOpenFilters}
            className="flex items-center justify-center gap-2 h-10 px-3.5 bg-white border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs"
          >
            <Filter size={14} className="text-slate-500" />
            <span>Filters</span>
          </button>

          {hasActiveFilters && (
            <button 
              onClick={handleResetAll}
              className="flex items-center justify-center gap-1.5 h-10 px-3 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-xl text-xs font-bold text-rose-700 transition-all cursor-pointer shadow-2xs"
            >
              <X size={13} />
              <span>Reset</span>
            </button>
          )}

          {/* Segmented Control (List / Calendar) */}
          <div className="flex bg-slate-100/80 p-1 rounded-xl h-10 border border-slate-200/60 shadow-2xs">
            <button
              onClick={() => workspace.setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                workspace.viewMode === "list" 
                  ? "bg-white text-blue-700 shadow-2xs" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <List size={14} /> 
              <span>List</span>
            </button>
            <button
              onClick={() => workspace.setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                workspace.viewMode === "calendar" 
                  ? "bg-white text-blue-700 shadow-2xs" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <CalendarDays size={14} /> 
              <span>Calendar</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
