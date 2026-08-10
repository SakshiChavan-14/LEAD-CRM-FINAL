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
    <div className="mb-6 flex flex-col gap-3">
      {/* Search & Inline Filters Row */}
      <div className="bg-white border border-gray-200 shadow-sm p-2 rounded-xl flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-[#8B1023]/20 text-[14px] outline-none transition-all" 
            placeholder="Search leads, phone, enquiry no..." 
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        {/* Dropdowns */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {['status', 'source', 'course'].map((key) => (
            <select
              key={key}
              aria-label={`Filter by ${key}`}
              className="px-3 py-2.5 bg-gray-50 border border-transparent rounded-lg text-[13px] font-medium text-gray-700 outline-none focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-[#8B1023]/20 min-w-[130px] cursor-pointer transition-all"
              value={filters[key] || ""}
              onChange={(e) => onFilterChange && onFilterChange(key, e.target.value)}
            >
              <option value="">{toTitleCase(key)}</option>
              {(uniqueOptions[key] || []).map(opt => (
                <option key={opt} value={opt}>{toTitleCase(opt)}</option>
              ))}
            </select>
          ))}
          
          {/* Advanced Filters Button */}
          <button 
            onClick={onOpenFilters}
            aria-label="Open advanced filters"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium text-[13px] rounded-lg hover:bg-gray-50 transition-all shrink-0"
          >
            <Filter size={14} />
            Filters
            {hasActiveFilters && activeFiltersCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 bg-[#8B1023] text-white text-[11px] font-bold rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeKeys.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center px-1">
          <span className="text-[12px] font-medium text-gray-500 mr-1">Active Filters:</span>
          {activeKeys.map((key) => (
            <div key={key} className="flex items-center gap-1.5 bg-white border border-gray-200 px-2.5 py-1 rounded-full shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{key}:</span>
              <span className="text-[12px] font-medium text-gray-900">{toTitleCase(filters[key])}</span>
              <button 
                onClick={() => onClearFilter && onClearFilter(key)}
                className="ml-1 text-gray-400 hover:text-gray-700 focus:outline-none"
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
