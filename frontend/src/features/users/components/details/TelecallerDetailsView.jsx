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

import { ArrowLeft } from "lucide-react";
import { useNavigationBack } from "@/hooks/useNavigationBack";

export default function TelecallerDetailsView({
  userId,
  telecaller,
  isLoading,
  isError,
}) {
  const { goBack, hasReturnTo } = useNavigationBack({
    fallback: "/dashboard/management/user-directory",
  });
  if (isLoading) {
    return (
      <div className="py-6 px-4 sm:px-6 max-w-[1600px] mx-auto w-full font-outfit space-y-6">
        <DashboardSkeleton />
      </div>
    );
  }

  if (isError || !telecaller) {
    return (
      <div className="py-6 px-4 sm:px-6 max-w-[1600px] mx-auto w-full font-outfit space-y-6">
        <ErrorState
          title="Error Loading Telecaller Details"
          message="Failed to load telecaller details."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 max-w-[1600px] mx-auto w-full font-outfit space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={goBack}
          className="px-3.5 py-2 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-2 text-xs font-bold text-slate-700 shadow-2xs cursor-pointer active:scale-95"
        >
          <ArrowLeft size={15} />
          {hasReturnTo ? "Back" : "Back to User Directory"}
        </button>
      </div>

      <ManagementHeader
        title="Performance Dashboard"
        description="View telecaller profile, performance analytics, and workload."
        breadcrumbs={breadcrumbs.telecallerDetails}
        actions={<div />}
      />
      
      <div className="space-y-6 pb-10">
        <TelecallerHeader profile={telecaller.profile} kpi={telecaller.kpi} />

        <PerformanceSnapshot kpi={telecaller.kpi} />

        {/* Row 1: Profile Information & Calls Performance Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <ProfileSection profile={telecaller.profile} kpi={telecaller.kpi} />
          <CallsTrendChart data={telecaller.callsPerformance} />
        </div>

        {/* Row 2: Call Outcome Breakdown & Lead Pipeline Progression */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <CallOutcomeChart data={telecaller.callOutcomes} />
          <LeadPipelineChart data={telecaller.leadPipeline} />
        </div>

        {/* Assigned Leads Table */}
        <AssignedLeadsSection leads={telecaller.assignedLeads} userId={userId} />

        {/* Recent Call Logs Table */}
        <RecentCallLogsSection userId={userId} />
      </div>
    </div>
  );
}
