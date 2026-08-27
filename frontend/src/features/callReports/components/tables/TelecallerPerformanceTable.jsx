"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCallReportsSummary } from "../../hooks/useCallReports";
import { TableSkeleton } from "@/components/ui/Skeletons";
import { EmptyState } from "@/components/dashboard-ui/EmptyState";
import { PhoneOff } from "lucide-react";
import ErrorState from "@/components/ui/ErrorState";

import CallReportsHeader from "../ui/CallReportsHeader";
import CallReportsStats from "../ui/CallReportsStats";
import CallReportsFilters from "../filters/CallReportsFilters";
import CallReportsTable from "./CallReportsTable";

import { useDetailNavigation } from "@/hooks/useDetailNavigation";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { useUrlState } from "@/hooks/useUrlState";

function parseDurationToSeconds(dur) {
  if (typeof dur === "number") return dur;
  if (typeof dur !== "string" || !dur) return 0;
  const parts = dur.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

function formatDuration(s) {
  if (!s) return "03m 15s";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${sec}s`;
}

export default function TelecallerPerformanceTable() {
  const { navigateToDetail } = useDetailNavigation();
  const { getParam, setParams } = useUrlState();

  const search = getParam("search", "");
  const selectedDate = getParam("date", "");
  const page = parseInt(getParam("page", "0"), 10);
  const pageSize = parseInt(getParam("size", "10"), 10);

  const setSearch = (val) => setParams({ search: val, page: 0 });
  const setSelectedDate = (val) => setParams({ date: val, page: 0 });
  const setPage = (p) => setParams({ page: p }, { resetPage: false });
  const setPageSize = (s) => setParams({ size: s, page: 0 });

  const { data, isLoading, isError } = useCallReportsSummary(
    { date: selectedDate, search },
    page,
    pageSize
  );

  useScrollRestoration({ ready: !isLoading && data !== undefined });

  const rawRows = Array.isArray(data?.content)
    ? data.content
    : Array.isArray(data?.users)
    ? data.users
    : Array.isArray(data)
    ? data
    : [];

  const rows = rawRows;

  const totalPages = data?.totalPages ?? (rows.length > 0 ? 1 : 0);
  const totalItems = data?.totalElements ?? data?.totalItems ?? rows.length;

  const stats = React.useMemo(() => {
    let totalCalls = 0;
    let connectedCalls = 0;
    let durationSecs = 0;
    
    rows.forEach(row => {
      totalCalls += (row.calls || row.totalCalls || 0);
      connectedCalls += (row.connectedCalls || 0);
      durationSecs += parseDurationToSeconds(row.duration || row.avgDuration);
    });

    const avgSecs = rows.length > 0 ? Math.round(durationSecs / rows.length) : 0;

    return {
      totalCalls: totalCalls,
      connectedCalls: connectedCalls,
      avgDuration: avgSecs > 0 ? formatDuration(avgSecs) : "00m 00s",
      recordings: 0,
      successRate: totalCalls > 0 && connectedCalls > 0 ? Math.round((connectedCalls / totalCalls) * 100) : 0,
      todaysCalls: 0
    };
  }, [rows]);

  const handleRowClick = (row) => {
    const id = row.userId ?? row.slNo ?? row.id ?? row.empId;
    if (id) {
      navigateToDetail(`/dashboard/management/call-reports/${id}`);
    }
  };

  const paginationProps = {
    currentPage: page,
    pageSize,
    totalPages,
    totalItems,
    onPageChange: setPage,
    onPageSizeChange: (s) => { setPageSize(s); setPage(0); },
  };

  if (isLoading) {
    return (
      <div className="py-6 px-4 sm:px-6 max-w-[1600px] mx-auto w-full font-outfit space-y-6">
        <CallReportsHeader />
        <CallReportsStats stats={{}} />
        <TableSkeleton rows={6} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-6 px-4 sm:px-6 max-w-[1600px] mx-auto w-full font-outfit space-y-6">
        <CallReportsHeader />
        <CallReportsStats stats={{}} />
        <ErrorState 
          title="Failed to load call reports"
          message="Check your connection and try again"
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 max-w-[1600px] mx-auto w-full font-outfit space-y-6">
      <CallReportsHeader />
      <CallReportsStats stats={stats} />
      
      <CallReportsFilters 
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(0); }}
        selectedDate={selectedDate}
        onDateChange={(val) => { setSelectedDate(val); setPage(0); }}
      />

      <CallReportsTable 
        data={rows}
        onRowClick={handleRowClick}
        paginationProps={paginationProps}
      />
    </div>
  );
}
