"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X, Users, Sparkles, LayoutGrid, List } from "lucide-react";
import { useTelecallerLeads } from "@/features/telecaller/hooks/useMyLeads";
import { useLeadFilterOptions } from "@/features/telecaller/hooks/useLeadFilterOptions";

import TelecallerLeadsBoard from "@/features/telecaller/leads/components/TelecallerLeadsBoard";

import MyLeadsKPISection from "@/features/telecaller/leads/components/MyLeadsKPISection";
import MyLeadsFilterToolbar from "@/features/telecaller/leads/components/MyLeadsFilterToolbar";
import MyLeadsTable from "@/features/telecaller/leads/components/MyLeadsTable";
import TablePagination from "@/components/table/TablePagination";
import { useVoice } from "@/features/telecaller/voice/context/VoiceProvider";

import { useDetailNavigation } from "@/hooks/useDetailNavigation";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { useUrlState } from "@/hooks/useUrlState";

const toTitleCase = (str) => {
  if (!str) return "-";
  return str
    .toLowerCase()
    .split(/[\s_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const FILTER_KEYS = ["status", "source", "course", "opinion"];

export default function TelecallerLeadsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { navigateToDetail } = useDetailNavigation();
  const { getParam, setParams } = useUrlState();

  const searchTerm = getParam("search", "");
  const page = parseInt(getParam("page", "0"), 10);
  const size = parseInt(getParam("size", "10"), 10);
  const viewMode = getParam("view", "list"); // 'list' or 'board'

  const setPage = (p) => setParams({ page: p }, { resetPage: false });
  const setSize = (s) => setParams({ size: s, page: 0 });
  const setViewMode = (v) => setParams({ view: v }, { resetPage: false });
  
  // Read initial filters from URL search params
  const filters = useMemo(() => {
    const initial = {};
    for (const key of FILTER_KEYS) {
      const val = searchParams.get(key);
      if (val && val.toUpperCase() !== "ALL") initial[key] = val;
    }

    // Handle cross-mapping for status & opinion aliases
    const statusParam = searchParams.get("status");
    if (statusParam) {
      const upperStatus = statusParam.toUpperCase();
      if (upperStatus === "INTERESTED") {
        initial.opinion = "Interested";
        delete initial.status;
      } else if (upperStatus === "ADMISSION" || upperStatus === "CONVERTED") {
        initial.status = "COMPLETED";
      }
    }

    return initial;
  }, [searchParams]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const querySize = viewMode === "board" ? 100 : size;
  const queryPage = viewMode === "board" ? 0 : page;

  // Combine search and active filters into a single object for the API & query key
  const combinedFilters = useMemo(() => {
    const cf = {};
    if (searchTerm.trim()) cf.search = searchTerm.trim();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).trim() !== "" && String(v).toUpperCase() !== "ALL") {
        cf[k] = String(v).trim();
      }
    });
    return cf;
  }, [searchTerm, filters]);

  const {
    data,
    isLoading,
    error,
  } = useTelecallerLeads(combinedFilters, queryPage, querySize);

  useScrollRestoration({ ready: !isLoading && data !== undefined });

  const voiceCtx = useVoice();
  const { data: serverFilterOptions } = useLeadFilterOptions();

  const rawLeads = data?.leads && data.leads.length > 0 ? data.leads : [];

  const uniqueOptions = useMemo(() => {
    const sStatuses = serverFilterOptions?.statuses || serverFilterOptions?.status || [];
    const sCourses = serverFilterOptions?.courses || serverFilterOptions?.course || [];
    const sSources = serverFilterOptions?.sources || serverFilterOptions?.source || [];
    const sOpinions = serverFilterOptions?.opinions || serverFilterOptions?.opinion || [];

    const defaultStatuses = ["ENQUIRY", "COLD", "WARM", "HOT", "COMPLETED", "NOT_INTERESTED"];
    const defaultCourses = ["B.Tech", "M.Tech", "BCA", "MCA", "BBA", "MBA", "B.Com", "B.Sc"];
    const defaultSources = ["Instagram", "Facebook", "Google Ads", "Direct", "Website", "Walk-in", "Referral"];
    const defaultOpinions = ["Interested", "Cold", "Warm", "Hot", "Not Interested"];

    const mergeUnique = (defaults, serverOpts, leadOpts) => {
      const set = new Set();
      const list = [];
      const add = (item) => {
        if (!item || typeof item !== "string") return;
        const trimmed = item.trim();
        if (!trimmed) return;
        const key = trimmed.toUpperCase();
        if (!set.has(key)) {
          set.add(key);
          list.push(trimmed);
        }
      };
      (serverOpts || []).forEach(add);
      (leadOpts || []).forEach(add);
      (defaults || []).forEach(add);
      return list;
    };

    return {
      status: mergeUnique(defaultStatuses, sStatuses, rawLeads.map(l => l.status)),
      course: mergeUnique(defaultCourses, sCourses, rawLeads.map(l => l.course)),
      source: mergeUnique(defaultSources, sSources, rawLeads.map(l => l.source)),
      opinion: mergeUnique(defaultOpinions, sOpinions, rawLeads.map(l => l.opinion)),
    };
  }, [serverFilterOptions, rawLeads]);

  const handleFilterChange = (key, value) => {
    setParams({ [key]: value, page: 0 });
  };

  const handleClearFilter = (key) => {
    handleFilterChange(key, "");
  };

  const clearAllFilters = () => {
    const cleared = {};
    FILTER_KEYS.forEach(k => { cleared[k] = null; });
    setParams({ ...cleared, page: 0 });
  };

  const activeFilterKeys = Object.keys(filters).filter(k => filters[k]);
  const hasActiveFilters = activeFilterKeys.length > 0;

  const allLeads = rawLeads;
  const totalItems = data?.totalItems ?? allLeads.length;
  const totalPages = data?.totalPages ?? (Math.ceil(totalItems / size) || 1);

  const handleRowClick = (row) => {
    navigateToDetail(`/telecaller/leads/${row.enquiryNo || row.id}`);
  };

  const kpiData = useMemo(() => {
    return {
      totalAssigned: totalItems || 0,
      newLeads: allLeads.filter(l => (l.status||'').toUpperCase().includes('NEW') || (l.status||'').toUpperCase().includes('ENQUIRY')).length,
      inProgress: allLeads.filter(l => (l.status||'').toUpperCase().includes('PROGRESS') || (l.status||'').toUpperCase().includes('FOLLOW') || (l.status||'').toUpperCase().includes('WARM') || (l.status||'').toUpperCase().includes('HOT')).length,
      interested: allLeads.filter(l => (l.opinion||'').toUpperCase().includes('INTERESTED') || (l.opinion||'').toUpperCase().includes('HOT')).length,
      notInterested: allLeads.filter(l => (l.opinion||'').toUpperCase().includes('NOT') || (l.status||'').toUpperCase().includes('NOT')).length,
      converted: allLeads.filter(l => (l.status||'').toUpperCase().includes('ADMISSION') || (l.status||'').toUpperCase().includes('ENROLLED') || (l.status||'').toUpperCase().includes('COMPLETED')).length,
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
              onCall={(lead) => {
                const returnTo = encodeURIComponent(pathname || "/telecaller/leads");
                if (lead?.enquiryNo || lead?.id) {
                  router.push(`/telecaller/calling/${lead.enquiryNo || lead.id}?returnTo=${returnTo}`);
                } else if (lead?.mobileNo || lead?.phone) {
                  router.push(`/telecaller/calling/manual?phone=${encodeURIComponent(lead.mobileNo || lead.phone)}&returnTo=${returnTo}`);
                }
              }}
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
