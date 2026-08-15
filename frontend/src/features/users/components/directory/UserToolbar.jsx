"use client";

import React from "react";
import { Search, Filter, CheckCircle2, XCircle } from "lucide-react";

export default function UserToolbar({ search, onSearchChange, status, onStatusChange }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs font-outfit">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        
        {/* Search Bar with modern styling */}
        <div className="relative w-full sm:max-w-md">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            className="w-full h-11 pl-10 pr-4 bg-slate-50/70 border border-slate-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none" 
            placeholder="Search by name, email, phone or EMP ID..." 
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Status Filter Buttons / Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400 shrink-0 hidden sm:inline-block">Status:</span>
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 w-full sm:w-auto">
            <button
              onClick={() => onStatusChange("")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                status === "" 
                  ? "bg-white text-slate-900 shadow-2xs" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => onStatusChange("ACTIVE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                status === "ACTIVE" 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs" 
                  : "text-slate-500 hover:text-emerald-700"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Active
            </button>
            <button
              onClick={() => onStatusChange("INACTIVE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                status === "INACTIVE" 
                  ? "bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs" 
                  : "text-slate-500 hover:text-rose-700"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Inactive
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
