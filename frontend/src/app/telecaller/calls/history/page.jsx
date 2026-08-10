"use client";

import React from "react";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/management/PageHeader";
import { telecallerBreadcrumbs } from "@/config/telecallerBreadcrumbs";
import { useCallHistory } from "@/features/telecaller/voice/hooks/useCallHistory";

import RecentCallsKPIs from "@/features/telecaller/calls/sections/RecentCallsKPIs";
import RecentCallsTable from "@/features/telecaller/calls/tables/RecentCallsTable";

export default function CallsHistoryPage() {
  const { data: calls } = useCallHistory();

  return (
    <PageContainer size="wide" className="py-8 space-y-6">
      <PageHeader
        title="Recent Calls"
        description="View outbound and inbound call history, recordings, durations, connection status and analytics."
        breadcrumbs={telecallerBreadcrumbs.callsHistory}
      />
      
      {/* KPIs Section */}
      <RecentCallsKPIs calls={calls} />

      {/* Data Table */}
      <RecentCallsTable />
      
    </PageContainer>
  );
}
