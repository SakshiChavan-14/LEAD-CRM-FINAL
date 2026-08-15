"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Users, Sparkles, LayoutGrid, List } from "lucide-react";
import { useTelecallerLeads } from "@/features/telecaller/hooks/useMyLeads";

import TelecallerLeadsBoard from "@/features/telecaller/leads/components/TelecallerLeadsBoard";

import MyLeadsKPISection from "@/features/telecaller/leads/components/MyLeadsKPISection";
import MyLeadsFilterToolbar from "@/features/telecaller/leads/components/MyLeadsFilterToolbar";
import MyLeadsTable from "@/features/telecaller/leads/components/MyLeadsTable";
import TablePagination from "@/components/table/TablePagination";
import { useVoice } from "@/features/telecaller/voice/context/VoiceProvider";

const toTitleCase = (str) => {
  if (!str) return "-";
  return str
    .toLowerCase()
    .split(/[\s_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};



export default function TelecallerLeadsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'board'

  const querySize = viewMode === "board" ? 100 : size;
  const queryPage = viewMode === "board" ? 0 : page;

  const {
    data,
    isLoading,
    error,
  } = useTelecallerLeads({ search: searchTerm }, queryPage, querySize);

  const voiceCtx = useVoice();

  const rawLeads = data?.leads && data.leads.length > 0 ? data.leads : [];

  const uniqueOptions = useMemo(() => ({
    status: [...new Set(rawLeads.map(l => l.status).filter(Boolean))],
    course: [...new Set(rawLeads.map(l => l.course).filter(Boolean))],
    source: [...new Set(rawLeads.map(l => l.source).filter(Boolean))],
    opinion: [...new Set(rawLeads.map(l => l.opinion).filter(Boolean))],
  }), [rawLeads]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleClearFilter = (key) => {
    setFilters(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setPage(0);
  };

  const clearAllFilters = () => {
    setFilters({});
    setPage(0);
  };

  const activeFilterKeys = Object.keys(filters).filter(k => filters[k]);
  const hasActiveFilters = activeFilterKeys.length > 0;

  const allLeads = rawLeads;
  const totalItems = data?.totalItems || allLeads.length;
  const totalPages = data?.totalPages || Math.ceil(allLeads.length / size);

  const handleRowClick = (row) => {
    router.push(`/telecaller/leads/${row.enquiryNo || row.id}`);
  };

  const kpiData = useMemo(() => {
    return {
      totalAssigned: totalItems || 0,
      newLeads: allLeads.filter(l => (l.status||'').toUpperCase().includes('NEW')).length,
      inProgress: allLeads.filter(l => (l.status||'').toUpperCase().includes('PROGRESS') || (l.status||'').toUpperCase().includes('FOLLOW')).length,
      interested: allLeads.filter(l => (l.opinion||'').toUpperCase().includes('INTERESTED') || (l.opinion||'').toUpperCase().includes('HOT')).length,
      notInterested: allLeads.filter(l => (l.opinion||'').toUpperCase().includes('NOT')).length,
      converted: allLeads.filter(l => (l.status||'').toUpperCase().includes('ADMISSION') || (l.status||'').toUpperCase().includes('ENROLLED')).length,
    };
  }, [allLeads, totalItems]);

  return (
    <div className={`py-6 px-4 sm:px-6 max-w-[1600px] mx-auto w-full font-outfit ${viewMode === "board" ? "space-y-4" : "space-y-6"}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Assigned Leads</h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Active prospective students assigned to your telecalling queue • <span className="text-blue-600 font-bold">{totalItems} Total Leads</span>
          </p>
        </div>
        <div className="flex items-center bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 flex items-center gap-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === "list" 
                ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <List size={14} /> List
          </button>
          <button
            onClick={() => setViewMode("board")}
            className={`px-3 py-1.5 flex items-center gap-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === "board" 
                ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <LayoutGrid size={14} /> Board
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {viewMode === "list" && <MyLeadsKPISection kpiData={kpiData} />}

      {/* Filters Toolbar */}
      {viewMode === "list" && (
        <MyLeadsFilterToolbar 
          hasActiveFilters={hasActiveFilters}
          activeFiltersCount={activeFilterKeys.length}
          onOpenFilters={() => setIsFilterOpen(true)}
          uniqueOptions={uniqueOptions}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilter={handleClearFilter}
        />
      )}

      {/* Leads Container */}
      {viewMode === "list" ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-md transition-all duration-300">
          <div className="overflow-x-auto no-scrollbar [scrollbar-width:none]">
            <MyLeadsTable 
              data={allLeads} 
              isLoading={isLoading} 
              onRowClick={handleRowClick}
              onCall={(number) => voiceCtx?.startCall(null, number)}
            />
          </div>

          {allLeads.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/50">
              <TablePagination
                mode="page"
                currentPage={page}
                pageSize={size}
                totalItems={totalItems}
                totalPages={totalPages}
                onPageChange={setPage}
                onPageSizeChange={(newSize) => { setSize(newSize); setPage(0); }}
              />
            </div>
          )}
        </div>
      ) : (
        <TelecallerLeadsBoard leads={allLeads} onRowClick={handleRowClick} />
      )}

      {/* Filter Drawer Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-xs" onClick={() => setIsFilterOpen(false)} />
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 font-outfit">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-slate-900">Refine Filter Criteria</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar [scrollbar-width:none]">
              {Object.entries(uniqueOptions).map(([key, options]) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 capitalize">{key}</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                    value={filters[key] || ""}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                  >
                    <option value="">All {toTitleCase(key)}s</option>
                    {options.map(opt => (
                      <option key={opt} value={opt}>{toTitleCase(opt)}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/70 flex gap-3">
              <button 
                onClick={() => {
                  clearAllFilters();
                  setIsFilterOpen(false);
                }}
                className="flex-1 px-4 py-2.5 border border-slate-200 bg-white text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs active:scale-95"
              >
                Clear
              </button>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer active:scale-95"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
