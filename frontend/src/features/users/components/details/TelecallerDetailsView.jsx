"use client";

import ErrorState from "@/components/ui/ErrorState";
import { DashboardSkeleton } from "@/components/dashboard-ui/DashboardSkeleton";
import TelecallerHeader from "./TelecallerHeader";
import PerformanceSnapshot from "./PerformanceSnapshot";
import ProfileSection from "./ProfileSection";
import CallsTrendChart from "./charts/CallsTrendChart";
import CallOutcomeChart from "./charts/CallOutcomeChart";
import LeadPipelineChart from "./charts/LeadPipelineChart";
import AssignedLeadsSection from "./AssignedLeadsSection";
import RecentCallLogsSection from "./RecentCallLogsSection";
import ManagementHeader from "@/components/management/ManagementHeader";
import { breadcrumbs } from "@/config/breadcrumbs";

import ContentSection from "@/components/management/ContentSection";
import KPIGrid from "@/components/management/KPIGrid";
import PageContainer from "@/components/layout/PageContainer";

export default function TelecallerDetailsView({
  userId,
  telecaller,
  isLoading,
  isError,
}) {
  if (isLoading) {
    return (
      <PageContainer size="wide" className="py-8 space-y-6">
        <div className="mt-6">
          <DashboardSkeleton />
        </div>
      </PageContainer>
    );
  }

  if (isError || !telecaller) {
    return (
      <PageContainer size="wide" className="py-8 space-y-6">
        <div className="mt-6">
          <ErrorState
            title="Error Loading Telecaller Details"
            message="Failed to load telecaller details."
            onRetry={() => window.location.reload()}
          />
        </div>
      </PageContainer>
    );
  }

  // Performance Snapshot and Profile Section will render below

  return (
    <PageContainer size="wide" className="py-8 space-y-6">
      <ManagementHeader
        title="Performance Dashboard"
        description="View telecaller profile, performance analytics, and workload."
        breadcrumbs={breadcrumbs.telecallerDetails}
        actions={<div />}
      />
      
      <ContentSection className="pb-10">
        <TelecallerHeader profile={telecaller.profile} kpi={telecaller.kpi} />

        <PerformanceSnapshot kpi={telecaller.kpi} />

        <KPIGrid columns={2} className="grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileSection profile={telecaller.profile} kpi={telecaller.kpi} />
          <CallsTrendChart data={telecaller.callsPerformance} />
        </KPIGrid>

        <KPIGrid columns={2} className="grid-cols-1 lg:grid-cols-2 gap-6">
          <CallOutcomeChart data={telecaller.callOutcomes} />
          <LeadPipelineChart data={telecaller.leadPipeline} />
        </KPIGrid>

        <div className="grid grid-cols-1 gap-6">
          <AssignedLeadsSection leads={telecaller.assignedLeads} userId={userId} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <RecentCallLogsSection userId={userId} />
        </div>
      </ContentSection>
    </PageContainer>
  );
}
