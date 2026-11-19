"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "@/components/management/PageHeader";
import { telecallerBreadcrumbs } from "@/config/telecallerBreadcrumbs";
import { useCallHistory } from "@/features/telecaller/voice/hooks/useCallHistory";

import RecentCallsKPIs from "@/features/telecaller/calls/sections/RecentCallsKPIs";
import RecentCallsTable from "@/features/telecaller/calls/tables/RecentCallsTable";

export default function CallsHistoryPage() {
  const { data: calls } = useCallHistory();
  const searchParams = useSearchParams();

  const paramFilter = searchParams.get("filter") || 
                      searchParams.get("status") || 
                      (searchParams.get("date") === "today" ? "today" : null);

  const [userFilter, setUserFilter] = useState(null);
  const activeFilter = userFilter ?? (paramFilter ? paramFilter.toLowerCase() : "all");

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 font-outfit space-y-6 animate-in fade-in duration-300">
        
        {/* Page Header */}
        <PageHeader
          title="Recent Calls History"
          description="View outbound and inbound call logs, student courses, districts, audio recordings, and analytics."
          breadcrumbs={telecallerBreadcrumbs.callsHistory}
        />
        
        {/* Interactive 8 KPIs Section */}
        <RecentCallsKPIs 
          calls={calls} 
          activeFilter={activeFilter} 
          onFilterChange={(newFilter) => setUserFilter(newFilter)} 
        />

        {/* Data Table with Infinite Scrolling */}
        <RecentCallsTable activeFilter={activeFilter} />
        
      </div>
    </div>
  );
}
