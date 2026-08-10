"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Phone, Eye, MoreVertical, X } from "lucide-react";
import { useTelecallerLeads } from "@/features/telecaller/hooks/useMyLeads";
import { TableSkeleton } from "@/components/ui/Skeletons";

// Formatters for Drawer
const toTitleCase = (str) => {
  if (!str) return "-";
  return str
    .toLowerCase()
    .split(/[\s_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Stitch Components
import "@/features/telecaller/leads/components/stitch-myleads-theme.css";
import PageContainer from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/management";
import MyLeadsKPISection from "@/features/telecaller/leads/components/MyLeadsKPISection";
import MyLeadsFilterToolbar from "@/features/telecaller/leads/components/MyLeadsFilterToolbar";
import MyLeadsTable from "@/features/telecaller/leads/components/MyLeadsTable";
import TablePagination from "@/components/table/TablePagination";
import { useVoice } from "@/features/telecaller/voice/context/VoiceProvider";

export default function TelecallerLeadsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    data,
    isLoading,
    error,
  } = useTelecallerLeads({ search: searchTerm }, page, size);

  const voiceCtx = useVoice();

  const uniqueOptions = useMemo(() => ({
    status: [...new Set((data?.leads || []).map(l => l.status).filter(Boolean))],
    course: [...new Set((data?.leads || []).map(l => l.course).filter(Boolean))],
    source: [...new Set((data?.leads || []).map(l => l.source).filter(Boolean))],
    opinion: [...new Set((data?.leads || []).map(l => l.opinion).filter(Boolean))],
    location: [...new Set((data?.leads || []).map(l => l.city || l.district).filter(Boolean))],
    calls: [...new Set((data?.leads || []).map(l => (l.callCount || 0).toString()))],
  }), [data?.leads]);

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

  let allLeads = data?.leads || [];
  
  // Note: Filtering is handled entirely by the backend via useTelecallerLeads.

  const totalItems = data?.totalItems || allLeads.length;
  const totalPages = data?.totalPages || Math.ceil(allLeads.length / size);

  const handleRowClick = (row) => {
    router.push(`/telecaller/leads/${row.enquiryNo}`);
  };

  // Compute KPIs
  const kpiData = useMemo(() => {
    const rawLeads = data?.leads || [];
    return {
      totalAssigned: data?.totalItems || rawLeads.length,
      newLeads: rawLeads.filter(l => (l.status||'').toUpperCase().includes('NEW') || (l.status||'').toUpperCase().includes('ENQUIRY')).length,
      inProgress: rawLeads.filter(l => (l.status||'').toUpperCase().includes('PROGRESS') || (l.status||'').toUpperCase().includes('FOLLOW')).length,
      interested: rawLeads.filter(l => (l.opinion||'').toUpperCase().includes('INTERESTED') && !(l.opinion||'').toUpperCase().includes('NOT')).length,
      notInterested: rawLeads.filter(l => (l.opinion||'').toUpperCase().includes('NOT INTERESTED')).length,
      converted: rawLeads.filter(l => (l.status||'').toUpperCase().includes('ADMISSION') || (l.status||'').toUpperCase().includes('ENROLLED')).length,
    };
  }, [data]);

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-medium">
          Failed to load leads. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <PageContainer size="wide" className="stitch-myleads pt-4 pb-8 max-w-[1440px] mx-auto space-y-5">
          
          <PageHeader
            className="md:items-end mb-4"
            title="My Leads"
            titleClassName="text-[42px] font-bold leading-tight tracking-tight text-on-surface"
            description={
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1.5 text-body-md text-on-surface-variant">
                  <span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(0,57,20,0.4)]"></span>
                  {totalItems} assigned {totalItems === 1 ? 'lead' : 'leads'}
                </span>
                <span className="text-outline-variant">•</span>
                <span className="text-body-md text-on-surface-variant">Live</span>
              </div>
            }
          />

          <MyLeadsKPISection kpiData={kpiData} />

          <MyLeadsFilterToolbar 
            hasActiveFilters={hasActiveFilters}
            activeFiltersCount={activeFilterKeys.length}
            onOpenFilters={() => setIsFilterOpen(true)}
            uniqueOptions={uniqueOptions}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilter={handleClearFilter}
          />

          <div className="bg-white premium-shadow rounded-2xl border border-gray-200 overflow-hidden flex flex-col mb-12 shadow-sm">
            <MyLeadsTable 
              data={allLeads} 
              isLoading={isLoading} 
              onRowClick={handleRowClick}
              onCall={(number) => voiceCtx?.startCall(null, number)}
            />

          {!isLoading && allLeads.length > 0 && (
            <TablePagination
              mode="page"
              currentPage={page}
              pageSize={size}
              totalItems={totalItems}
              totalPages={totalPages}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => { setSize(newSize); setPage(0); }}
            />
          )}
        </div>

        {/* EXISTING FILTER DRAWER OVERLAY (Preserved Functionality) */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/20" onClick={() => setIsFilterOpen(false)}></div>
            <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Refine Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {Object.entries(uniqueOptions).map(([key, options]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 capitalize">{key}</label>
                    <select 
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-800"
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

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                <button 
                  onClick={() => {
                    clearAllFilters();
                    setIsFilterOpen(false);
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Clear
                </button>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-container transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
