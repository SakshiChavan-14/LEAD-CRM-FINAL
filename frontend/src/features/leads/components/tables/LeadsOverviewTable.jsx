"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { useLeadOverview } from "@/features/leads/hooks/useLeadOverview";
import { useLeadFilterOptions } from "@/features/leads/hooks/useLeadFilterOptions";
import { useLeadCounts } from "@/features/leads/hooks/useLeadCounts";
import useUsers from "@/features/users/hooks/useUsers";
import { useAssignLeads } from "@/features/leads/hooks/useAssignLeads";
import { FILTER_CONFIG } from "@/features/leads/constants/filterConfig";

import ReusableFilterDrawer from "@/components/layout/ReusableFilterDrawer";
import LeadFilters from "@/features/leads/components/filters/LeadFilters";
import AssignLeadsModal from "@/features/leads/components/dialogs/AssignLeadsModal";

// Modular Sections
import LeadsKPICards from "@/features/leads/components/kpis/LeadsKPICards";
import LeadsFilterPills from "@/features/leads/components/filters/LeadsFilterPills";
import LeadTableSection from "@/features/leads/components/tables/LeadTableSection";

const SPECIAL_FILTER_KEYS = ["state", "district", "taluk"];
const FILTER_LABELS = {
  source: "Source",
  status: "Status",
  callerName: "Telecaller",
  course: "Course",
  opinion: "Opinion",
  state: "State",
  district: "District",
  taluk: "Taluk"
};

import FilterToolbar from "@/components/management/FilterToolbar";

export default function LeadsOverviewTable({ filters, actions, search }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignMode, setAssignMode] = useState("assign");

  const [draftFilters, setDraftFilters] = useState({});
  const refineButtonRef = useRef(null);

  // Destructure filters so they go to the hook correctly
  const { page = 0, size = 10, sort = "", type = "", source = "", status = "", callerName = "", course = "", opinion = "", state = "", district = "", taluk = "" } = filters;

  // Build sub-filters object (everything except page/size/sort)
  const subFilters = {
    ...(search ? { search } : {}),
    ...(source ? { source } : {}),
    ...(status ? { status } : {}),
    ...(callerName ? { callerName } : {}),
    ...(course ? { course } : {}),
    ...(opinion ? { opinion } : {}),
    ...(state ? { state } : {}),
    ...(district ? { district } : {}),
    ...(taluk ? { taluk } : {}),
  };

  // Clear selection on page change
  React.useEffect(() => {
    setSelectedRows([]);
  }, [page]);

  const { data: filterOptions } = useLeadFilterOptions();
  const { data: usersData } = useUsers({ size: 1000 });
  const telecallers = usersData?.users || [];

  const { mutate: assignLeads, isPending: isAssigningLeads } = useAssignLeads(() => {
    setSelectedRows([]);
    setIsAssignModalOpen(false);
  });

  // Fetch all leads if tab/type is active to filter and paginate on client-side
  const querySize = type ? 10000 : size;
  const queryPage = type ? 0 : page;

  // Call hook with the correct signature: ({ filters, page, size, sort })
  const query = useLeadOverview({ filters: subFilters, page: queryPage, size: querySize, sort });
  const { data, isLoading, isError, error, isFetching } = query;

  const rawLeadsData = data?.leads || [];
  
  // Filter leads based on selected tab/type
  const filteredLeads = useMemo(() => {
    if (type === "hot") {
      return rawLeadsData.filter(l => {
        const s = (l.status || "").toUpperCase();
        const o = (l.opinion || l.temperature || "").toUpperCase();
        return s === "HOT" || o === "HOT" || o === "INTERESTED";
      });
    }
    if (type === "cold") {
      return rawLeadsData.filter(l => {
        const s = (l.status || "").toUpperCase();
        const o = (l.opinion || l.temperature || "").toUpperCase();
        const isHot = s === "HOT" || o === "HOT" || o === "INTERESTED";
        if (isHot) return false;
        return s === "COLD" || o === "COLD" || o === "NOT INTERESTED";
      });
    }
    if (type === "warm") {
      return rawLeadsData.filter(l => {
        const s = (l.status || "").toUpperCase();
        const o = (l.opinion || l.temperature || "").toUpperCase();
        const isHot = s === "HOT" || o === "HOT" || o === "INTERESTED";
        const isCold = s === "COLD" || o === "COLD" || o === "NOT INTERESTED";
        return !isHot && !isCold;
      });
    }
    return rawLeadsData;
  }, [rawLeadsData, type]);

  // Client-side pagination when type/tab is active
  const leadsData = useMemo(() => {
    if (type) {
      const start = page * size;
      const end = start + size;
      return filteredLeads.slice(start, end);
    }
    return filteredLeads;
  }, [filteredLeads, page, size, type]);

  const totalResults = useMemo(() => {
    if (type) {
      return filteredLeads.length;
    }
    return data?.totalItems || 0;
  }, [data?.totalItems, filteredLeads.length, type]);

  const currentPage = page;
  const pageSize = size;
  const totalPages = type 
    ? Math.ceil(totalResults / pageSize) 
    : (data?.totalPages || 1);

  const { data: bucketCounts = {} } = useLeadCounts();

  const displayCounts = useMemo(() => {
    const updated = { ...bucketCounts };
    if (type) {
      updated[type] = totalResults;
    } else {
      updated.all = totalResults || bucketCounts.all || 0;
    }
    return updated;
  }, [bucketCounts, type, totalResults]);

  // Drawer Handlers
  const handleOpenDrawer = useCallback(() => {
    const initialDraft = {};
    FILTER_CONFIG.forEach(c => {
       if (filters[c.key]) initialDraft[c.key] = filters[c.key];
    });
    SPECIAL_FILTER_KEYS.forEach(k => {
       if (filters[k]) initialDraft[k] = filters[k];
    });
    setDraftFilters(initialDraft);
    setIsDrawerOpen(true);
  }, [filters]);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setTimeout(() => refineButtonRef.current?.focus(), 100);
  }, []);

  const handleApplyFilters = useCallback(() => {
    const validUpdates = {};
    
    // Explicitly set all known filters to empty to clear any removed ones
    FILTER_CONFIG.forEach(c => { validUpdates[c.key] = ""; });
    SPECIAL_FILTER_KEYS.forEach(k => { validUpdates[k] = ""; });

    Object.entries(draftFilters).forEach(([key, val]) => {
      const isConfigured = FILTER_CONFIG.some(c => c.key === key);
      const isSpecial = SPECIAL_FILTER_KEYS.includes(key);

      if (isConfigured || isSpecial) {
        validUpdates[key] = val;
      }
    });
    
    if (actions.setFilters) {
      actions.setFilters(validUpdates);
    }
    handleCloseDrawer();
  }, [draftFilters, actions, handleCloseDrawer]);

  const handleResetFilters = useCallback(() => {
    setDraftFilters({});
  }, []);

  // Table Handlers
  const router = useRouter();

  const handleRowClick = useCallback((lead) => {
    router.push(`/dashboard/management/leads/${lead.enquiryNo}`);
  }, [router]);

  const handleAssign = useCallback((telecallerId) => {
    assignLeads({
      userId: telecallerId,
      enquiryIds: selectedRows,
    });
  }, [assignLeads, selectedRows]);

  // Compute active filters to show as removable chips
  const activeFilters = useMemo(() => {
    const keys = ["source", "status", "callerName", "course", "opinion", "state", "district", "taluk"];
    return keys
      .filter(k => filters[k] !== undefined && filters[k] !== null && filters[k] !== "")
      .map(k => ({ key: k, value: filters[k], label: FILTER_LABELS[k] || k }));
  }, [filters]);

  const hasActiveFilters = activeFilters.length > 0;

  const handleRemoveFilter = useCallback((key) => {
    if (actions.setFilters) {
      actions.setFilters({ [key]: "" });
    }
  }, [actions]);

  const handleClearAllFilters = useCallback(() => {
    const cleared = {};
    const keys = ["source", "status", "callerName", "course", "opinion", "state", "district", "taluk"];
    keys.forEach(k => { cleared[k] = ""; });
    if (actions.setFilters) {
      actions.setFilters(cleared);
    }
  }, [actions]);

  return (
    <>
      <LeadsKPICards counts={bucketCounts} />
      
      <FilterToolbar>
        <LeadsFilterPills 
          activeFilter={type} 
          onSelect={actions.setType} 
          counts={displayCounts} 
        />
        
        {/* Bulk Action Bar: shown when rows are selected */}
        {selectedRows.length > 0 && (
          <div className="flex items-center gap-4 bg-blue-50/60 border border-blue-200/60 text-blue-700 px-4 py-2.5 rounded-xl shadow-sm w-full transition-all">
            <span className="text-sm font-semibold">
              {selectedRows.length} {selectedRows.length === 1 ? 'Lead' : 'Leads'} Selected
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => { setAssignMode("assign"); setIsAssignModalOpen(true); }}
                className="px-4 py-1.5 text-sm bg-white border border-admin-primary-border text-admin-primary-text font-medium rounded-lg shadow-sm hover:bg-admin-primary-subtle transition-colors cursor-pointer"
              >
                Assign
              </button>
              <button
                onClick={() => { setAssignMode("reassign"); setIsAssignModalOpen(true); }}
                className="px-4 py-1.5 text-sm bg-admin-primary text-white font-medium rounded-lg shadow-sm hover:bg-admin-primary-hover active:bg-admin-primary-active transition-colors cursor-pointer"
              >
                Reassign
              </button>
              <button
                onClick={() => setSelectedRows([])}
                className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors ml-2 cursor-pointer"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </FilterToolbar>

      {/* Applied Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-4 animate-in fade-in slide-in-from-top-1 duration-200 font-outfit">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mr-1">Active Filters:</span>
          {activeFilters.map((f) => (
            <div 
              key={f.key} 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold shadow-2xs hover:bg-blue-100/60 hover:border-blue-200 transition-all"
            >
              <span className="text-slate-400 font-semibold">{f.label}:</span>
              <span className="capitalize">{f.value}</span>
              <button 
                onClick={() => handleRemoveFilter(f.key)}
                className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-blue-200 text-blue-500 hover:text-blue-700 transition-colors cursor-pointer shrink-0 ml-0.5"
                title={`Remove ${f.label} filter`}
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            </div>
          ))}
          <button 
            onClick={handleClearAllFilters}
            className="text-xs font-bold text-[#6F1D28] hover:text-[#5a1720] hover:underline ml-2 transition-all cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}

      <LeadTableSection
        data={leadsData}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        onRowClick={handleRowClick}
        isLoading={isLoading}
        isError={isError}
        error={error}
        isFetching={isFetching}
        pagination={{
          currentPage,
          pageSize,
          totalPages,
          totalItems: totalResults,
          onPageChange: actions.setPage,
          onPageSizeChange: actions.setSize,
        }}
        onRetry={() => query.refetch()}
        onOpenFilters={handleOpenDrawer}
      />

      <ReusableFilterDrawer 
        isOpen={isDrawerOpen} 
        onClose={handleCloseDrawer}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        primaryButtonClass="bg-admin-primary hover:bg-admin-primary-hover focus:ring-admin-primary/20"
      >
        <LeadFilters 
          values={draftFilters} 
          options={filterOptions} 
          onChange={(key, value) => setDraftFilters(prev => ({ ...prev, [key]: value }))} 
        />
      </ReusableFilterDrawer>

      <AssignLeadsModal
        open={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        telecallers={telecallers}
        onAssign={handleAssign}
        isAssigning={isAssigningLeads}
        selectedCount={selectedRows.length}
        mode={assignMode}
      />
    </>
  );
}
