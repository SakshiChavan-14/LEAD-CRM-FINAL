"use client";


import DashboardStats from "@/features/dashboard/components/sections/DashboardStats";
import LeadTemperature from "@/features/dashboard/components/widgets/LeadTemperature";
import DashboardCharts from "@/features/dashboard/components/sections/DashboardCharts";
import DashboardBottom from "@/components/dashboard/DashboardBottom";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import { DashboardSkeleton } from "@/components/dashboard-ui/DashboardSkeleton";
import ErrorState from "@/components/ui/ErrorState";

import ContentSection from "@/components/management/ContentSection";

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboardStats();

  return (
    <ContentSection className="overflow-y-auto space-y-6 pr-2 pb-10">
      {/* DashboardNavbar in layout already provides the header and breadcrumbs */}

      {isLoading ? (
        <DashboardSkeleton />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          <DashboardStats stats={data?.stats} />
          <LeadTemperature temperature={data?.temperature} />
          <DashboardCharts 
            charts={data?.charts}
          />
          <DashboardBottom tables={data?.tables} timeline={data?.timeline} />
        </>
      )}
    </ContentSection>
  );
}