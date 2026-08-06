"use client";

import DashboardStats from "@/features/dashboard/components/sections/DashboardStats";
import LeadTemperature from "@/features/dashboard/components/widgets/LeadTemperature";
import PipelineChart from "@/features/dashboard/components/widgets/PipelineChart";
import SourceAnalytics from "@/features/dashboard/components/widgets/SourceAnalytics";
import RecentLeadsTable from "@/features/dashboard/components/widgets/RecentLeadsTable";
import FollowUpsCard from "@/features/dashboard/components/widgets/FollowUpsCard";
import ActivityTimeline from "@/features/dashboard/components/widgets/ActivityTimeline";
import TelecallerPerformanceCard from "@/features/dashboard/components/widgets/TelecallerPerformanceCard";
import AdmissionSummaryCard from "@/features/dashboard/components/widgets/AdmissionSummaryCard";
import MonthlyAdmissionTrendCard from "@/features/dashboard/components/widgets/MonthlyAdmissionTrendCard";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import { DashboardSkeleton } from "@/components/dashboard-ui/DashboardSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { ContentSection } from "@/components/management";

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
          
          {/* Charts Section */}
          <div className="grid gap-6 xl:grid-cols-10">
            <div className="xl:col-span-7">
              <PipelineChart pipeline={data?.charts?.pipeline} />
            </div>
            <div className="xl:col-span-3">
              <SourceAnalytics sourceAnalytics={data?.charts?.sourceAnalytics} />
            </div>
          </div>

          {/* Recent Leads & Follow-ups */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <RecentLeadsTable recentLeads={data?.tables?.recentLeads} />
            </div>
            <div className="xl:col-span-1">
              <FollowUpsCard followups={data?.tables?.followups} />
            </div>
          </div>

          {/* Telecaller Performance */}
          <div className="grid grid-cols-1 gap-6">
            <div className="w-full">
              <TelecallerPerformanceCard />
            </div>
          </div>

          {/* Recent Activity & Admission Trend */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-10">
            <div className="xl:col-span-4">
              <ActivityTimeline timeline={data?.timeline} />
            </div>
            <div className="xl:col-span-6">
              <MonthlyAdmissionTrendCard />
            </div>
          </div>

          {/* Admission Summary */}
          <div className="grid grid-cols-1 gap-6">
            <AdmissionSummaryCard />
          </div>
        </>
      )}
    </ContentSection>
  );
}