"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Filter, X } from "lucide-react";

const toTitleCase = (str) => {
  if (!str) return "";
  return str.toLowerCase().split(/[\s_]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

export default function MyLeadsFilterToolbar({ 
  hasActiveFilters = false, 
  activeFiltersCount = 0, 
  onOpenFilters,
  uniqueOptions = {},
  filters = {},
  onFilterChange,
  onClearFilter
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const initialSearch = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(initialSearch);

  useEffect(() => {
    setLocalSearch(initialSearch);
  }, [initialSearch]);

  const handleApplySearch = () => {
    const params = new URLSearchParams(searchParams);
    if (localSearch.trim()) {
      params.set("search", localSearch.trim());
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleApplySearch();
  };

  const activeKeys = Object.keys(filters).filter(k => filters[k]);

  return (
    <div className="flex flex-col gap-3 font-outfit">
      {/* Search & Inline Filters Row */}
      <div className="bg-white border border-slate-200/80 shadow-2xs p-2.5 rounded-2xl flex flex-col lg:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50/70 border border-slate-200/80 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all" 
            placeholder="Search leads by student name, phone, enquiry no..." 
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        {/* Dropdowns */}
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {['status', 'source', 'course'].map((key) => (
            <select
              key={key}
              aria-label={`Filter by ${key}`}
              className="px-3 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 outline-none hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 min-w-[130px] cursor-pointer transition-all capitalize"
              value={filters[key] || ""}
              onChange={(e) => onFilterChange && onFilterChange(key, e.target.value)}
            >
              <option value="">All {toTitleCase(key)}s</option>
              {(uniqueOptions[key] || []).map(opt => (
                <option key={opt} value={opt}>{toTitleCase(opt)}</option>
              ))}
            </select>
          ))}
          
          {/* Advanced Filters Button */}
          <button 
            onClick={onOpenFilters}
            aria-label="Open advanced filters"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200/80 text-slate-700 hover:text-blue-600 hover:border-blue-200 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all shrink-0 cursor-pointer shadow-2xs active:scale-95"
          >
            <Filter size={13} />
            <span>Filters</span>
            {hasActiveFilters && activeFiltersCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-[10px] font-extrabold rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeKeys.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center px-1">
          <span className="text-xs font-bold text-slate-400 mr-1">Active Filters:</span>
          {activeKeys.map((key) => (
            <div key={key} className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">{key}:</span>
              <span className="text-xs font-bold text-slate-900">{toTitleCase(filters[key])}</span>
              <button 
                onClick={() => onClearFilter && onClearFilter(key)}
                className="ml-1 text-slate-400 hover:text-rose-600 focus:outline-none cursor-pointer"
                aria-label={`Remove ${key} filter`}
              >
                <X size={12} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
