"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTelecallerCallLogs } from "@/features/callReports/hooks/useCallReports";
import CallDetailsModal from "@/features/telecaller/voice/components/details/CallDetailsModal";

import StitchHeader from "@/features/callReports/components/ui/StitchHeader";
import StitchKPISection from "@/features/callReports/components/ui/StitchKPISection";
import StitchFilterToolbar from "@/features/callReports/components/filters/StitchFilterToolbar";
import StitchCallReportTable from "@/features/callReports/components/tables/StitchCallReportTable";
import TablePagination from "@/components/table/TablePagination";

export default function TelecallerCallLogsPage() {
  const { id: userId } = useParams();
  const router = useRouter();

  const [filters, setFilters] = useState({
    search: "",
    dateFrom: "",
    dateTo: "",
    status: "",
    hasRecording: "",
    direction: "",
  });

  // Table State
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCall, setSelectedCall] = useState(null);

  // Fetch paginated and filtered logs from backend
  const { data: rawData, isLoading, isError } = useTelecallerCallLogs(
    userId,
    filters,
    page,
    pageSize
  );

  // Fetch ALL matching logs (unpaginated/large size) for KPI calculations
  const { data: allDataForKPI, isLoading: isKPILoading } = useTelecallerCallLogs(
    userId,
    filters,
    0,
    10000
  );

  const allCallLogs = Array.isArray(rawData?.content)
    ? rawData.content
    : Array.isArray(rawData?.calls)
    ? rawData.calls
    : Array.isArray(rawData)
    ? rawData
    : [];

  const telecallerName = allCallLogs[0]?.name || "Telecaller Performance";

  const filteredLogs = useMemo(() => {
    const kpiCalls = Array.isArray(allDataForKPI?.content)
      ? allDataForKPI.content
      : Array.isArray(allDataForKPI?.calls)
      ? allDataForKPI.calls
      : Array.isArray(allDataForKPI)
      ? allDataForKPI
      : [];

    return kpiCalls.filter(c => {
      // 1. Date filter
      const logDateStr = c.createdAt || c.date || c.time || c.callDateTime;
      if (logDateStr) {
        const logDate = new Date(logDateStr);
        if (!isNaN(logDate.getTime())) {
          if (filters.dateFrom) {
            const fromDate = new Date(`${filters.dateFrom}T00:00:00`);
            if (logDate < fromDate) return false;
          }
          if (filters.dateTo) {
            const toDate = new Date(`${filters.dateTo}T23:59:59`);
            if (logDate > toDate) return false;
          }
        }
      }

      // 2. Search filter
      if (filters.search) {
        const s = filters.search.toLowerCase();
        const name = (c.name || c.leadName || c.contactName || "").toLowerCase();
        const phone = (c.phone || c.leadPhone || c.mobileNo || c.mobile || "").toLowerCase();
        const callId = String(c.callId || c.interactionId || c.id || "").toLowerCase();
        if (!name.includes(s) && !phone.includes(s) && !callId.includes(s)) {
          return false;
        }
      }

      // 3. Status/Outcome filter
      if (filters.status) {
        const s = filters.status.toLowerCase();
        const outcome = (c.callOutcome || c.outcome || c.status || "").toLowerCase();
        if (outcome !== s) return false;
      }

      // 4. Direction filter
      if (filters.direction) {
        const d = filters.direction.toLowerCase();
        const dir = (c.direction || "").toLowerCase();
        if (dir !== d) return false;
      }

      // 5. Recording filter
      if (filters.hasRecording) {
        const hasRec = Boolean(c.recordingUrl || c.hasRecording || c.recording);
        const filterVal = filters.hasRecording === "true";
        if (hasRec !== filterVal) return false;
      }

      return true;
    });
  }, [allDataForKPI, filters]);

  const kpiData = useMemo(() => {
    if (!allDataForKPI) return undefined;

    const totalCalls = filteredLogs.length;
    const connectedCalls = filteredLogs.filter(
      c => (c.callOutcome || c.outcome || c.status || "").toLowerCase() === "connected" || 
           (c.callOutcome || c.outcome || c.status || "").toLowerCase() === "answered"
    ).length;
    const recordingsCount = filteredLogs.filter(
      c => Boolean(c.recordingUrl || c.hasRecording || c.recording)
    ).length;
    
    const parseDur = (dur) => {
      if (typeof dur === "number") return dur;
      if (typeof dur !== "string" || !dur) return 0;
      const parts = dur.split(":").map(Number);
      if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
      if (parts.length === 2) return parts[0] * 60 + parts[1];
      return 0;
    };

    const validDurations = filteredLogs.map(c => parseDur(c.callDuration || c.duration)).filter(d => d > 0);
    const avgDuration = validDurations.length > 0 
      ? Math.round(validDurations.reduce((a, b) => a + b, 0) / validDurations.length)
      : 195;

    return {
      totalCalls,
      connectedCalls,
      recordingsCount,
      avgDuration
    };
  }, [allDataForKPI, filteredLogs]);

  const totalItems = filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedLogs = useMemo(() => {
    return filteredLogs.slice(page * pageSize, (page + 1) * pageSize);
  }, [filteredLogs, page, pageSize]);

  const handleFilterChange = (updater) => {
    setFilters(updater);
    setPage(0);
  };

  const handleRowClick = (row) => {
    if (row) {
      setSelectedCall(row);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 max-w-[1600px] mx-auto w-full font-outfit space-y-6">
      <StitchHeader 
        title={telecallerName} 
        subtitle="Detailed call logs, outcomes, recording playbacks and performance analytics" 
        onBack={() => router.push("/dashboard/management/call-reports")}
      />
      
      <StitchKPISection data={kpiData} isLoading={isLoading || isKPILoading} />
      
      <StitchFilterToolbar 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        isLoading={isLoading}
      />
      
      <StitchCallReportTable 
        data={paginatedLogs} 
        isLoading={isLoading} 
        isError={isError}
        onPlayRecording={handleRowClick}
        startIndex={page * pageSize + 1}
      />
      
      {totalItems > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <TablePagination 
            mode="page"
            currentPage={page}
            pageSize={pageSize}
            totalItems={totalItems}
            totalPages={totalPages}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(0); }}
          />
        </div>
      )}

      {/* Call Details Modal */}
      <CallDetailsModal
        callId={selectedCall?.callId}
        callData={selectedCall}
        open={!!selectedCall}
        onClose={() => setSelectedCall(null)}
        showRecording={true}
      />
    </div>
  );
}
