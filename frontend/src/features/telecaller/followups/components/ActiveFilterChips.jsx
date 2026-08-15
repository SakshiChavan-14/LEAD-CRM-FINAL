"use client";

import { X } from "lucide-react";
import React from "react";

export default function ActiveFilterChips({ filters, datePreset, onRemoveFilter, onClearAll }) {
  const activeEntries = Object.entries(filters || {}).filter(([_, value]) => !!value);
  
  if (activeEntries.length === 0 && datePreset === "all") return null;

  return (
    <div className="pt-2 pb-1 w-full flex flex-col gap-2 font-outfit">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {datePreset !== "all" && (
            <div className="flex items-center gap-2 h-8 px-3 bg-blue-50 text-blue-900 rounded-full text-xs font-semibold border border-blue-200/80 shadow-2xs transition hover:bg-blue-100">
              <span className="flex items-center">
                <span className="text-blue-600 font-bold mr-1">Date:</span> 
                <span className="text-blue-900 font-extrabold">{datePreset.replace("_", " ").toUpperCase()}</span>
              </span>
              <button
                onClick={() => onRemoveFilter('datePreset')}
                className="p-0.5 hover:bg-blue-200 rounded-full transition-colors ml-1 text-blue-500 hover:text-blue-900 focus:outline-none cursor-pointer"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </div>
          )}

          {activeEntries.map(([key, value]) => {
            const label = key.charAt(0).toUpperCase() + key.slice(1);
            return (
              <div 
                key={key} 
                className="flex items-center gap-2 h-8 px-3 bg-blue-50 text-blue-900 rounded-full text-xs font-semibold border border-blue-200/80 shadow-2xs transition hover:bg-blue-100"
              >
                <span className="flex items-center">
                  <span className="text-blue-600 font-bold mr-1">{label}:</span> 
                  <span className="text-blue-900 font-extrabold">{value}</span>
                </span>
                <button
                  onClick={() => onRemoveFilter(key)}
                  className="p-0.5 hover:bg-blue-200 rounded-full transition-colors ml-1 text-blue-500 hover:text-blue-900 focus:outline-none cursor-pointer"
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              </div>
            );
          })}
        </div>
        
        <button 
          onClick={onClearAll}
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-bold shrink-0 transition-colors cursor-pointer"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
