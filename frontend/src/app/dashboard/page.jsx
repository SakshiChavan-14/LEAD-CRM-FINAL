"use client";

import DashboardStats from "@/features/dashboard/components/sections/DashboardStats";
import PipelineChart from "@/features/dashboard/components/widgets/PipelineChart";
import SourceAnalytics from "@/features/dashboard/components/widgets/SourceAnalytics";
import RecentLeadsTable from "@/features/dashboard/components/widgets/RecentLeadsTable";
import FollowUpsCard from "@/features/dashboard/components/widgets/FollowUpsCard";
import TelecallerPerformanceCard from "@/features/dashboard/components/widgets/TelecallerPerformanceCard";
import AdmissionSummaryCard from "@/features/dashboard/components/widgets/AdmissionSummaryCard";
import MonthlyAdmissionTrendCard from "@/features/dashboard/components/widgets/MonthlyAdmissionTrendCard";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import { DashboardSkeleton } from "@/components/dashboard-ui/DashboardSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import PageContainer from "@/components/layout/PageContainer";
import { ContentSection } from "@/components/management";
import { Download } from "lucide-react";

// Local helper component for Pending Actions to keep codebase footprint clean
function PendingActionsCard({ overdueCount, unassignedCount, verificationCount, callbacksTodayCount }) {
  const cardClass = "rounded-[24px] border border-slate-200 bg-white shadow-sm p-6 h-full flex flex-col justify-between font-outfit";
  return (
    <div className={cardClass}>
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Pending Actions</h2>
        
        <div className="space-y-4">
          {/* Overdue follow-ups */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded bg-rose-50 text-[#F43F5E] flex items-center justify-center font-bold text-sm shrink-0">!</span>
              <span className="text-slate-500 font-medium">Overdue follow-ups</span>
            </div>
            <span className="font-bold text-slate-800 text-base">{overdueCount}</span>
          </div>

          {/* Unassigned leads */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-lg leading-none shrink-0">•</span>
              <span className="text-slate-500 font-medium">Unassigned leads</span>
            </div>
            <span className="font-bold text-slate-800 text-base">{unassignedCount}</span>
          </div>

          {/* Verification pending */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded bg-emerald-50 text-[#10B981] flex items-center justify-center font-bold text-sm shrink-0">✓</span>
              <span className="text-slate-500 font-medium">Verification pending</span>
            </div>
            <span className="font-bold text-slate-800 text-base">{verificationCount}</span>
          </div>

          {/* Callbacks today */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded bg-violet-50 text-[#8B5CF6] flex items-center justify-center font-bold text-sm shrink-0">↻</span>
              <span className="text-slate-500 font-medium">Callbacks today</span>
            </div>
            <span className="font-bold text-slate-800 text-base">{callbacksTodayCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboardStats();

  return (
    <PageContainer size="wide" className="py-6">
      <ContentSection className="space-y-6 pb-10 max-w-[1600px] mx-auto px-6">
        
        {/* Custom Header with Greeting & Quick Actions */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-outfit px-1">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight leading-tight">
              Good Morning, Admin
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Here is what is happening in your CRM pipeline today.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => alert("Report Export started...")}
              className="flex items-center gap-2 bg-[#7F1D1D] hover:bg-[#991B1B] text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <Download size={16} />
              Export Report
            </button>
          </div>
        </header>

      {isLoading ? (
        <DashboardSkeleton />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          {/* 7 KPI Cards Grid */}
          <DashboardStats stats={data?.stats} />

          {/* Hot / Cold Leads Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-outfit">
            {/* Hot Leads */}
            <div className="bg-white border border-slate-200 rounded-[24px] px-6 h-[88px] flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center text-xl shrink-0">🔥</div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Hot Leads</span>
                <span className="text-xl font-bold text-slate-800 mt-0.5 leading-none">
                  {data?.temperature?.hot || 0} <span className="text-xs text-slate-400 font-semibold font-sans">leads</span>
                </span>
              </div>
            </div>

            {/* Cold Leads */}
            <div className="bg-white border border-slate-200 rounded-[24px] px-6 h-[88px] flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-xl shrink-0">❄️</div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Cold Leads</span>
                <span className="text-xl font-bold text-slate-800 mt-0.5 leading-none">
                  {data?.temperature?.cold || 0} <span className="text-xs text-slate-400 font-semibold font-sans">leads</span>
                </span>
              </div>
            </div>
          </div>
          
          {/* Admission Funnel (8) & Lead Sources (4) */}
          <div className="grid gap-6 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <PipelineChart pipeline={data?.charts?.pipeline} />
            </div>
            <div className="xl:col-span-4">
              <SourceAnalytics sourceAnalytics={data?.charts?.sourceAnalytics} />
            </div>
          </div>

          {/* Telecaller Performance (7) & Monthly Trend (5) */}
          <div className="grid gap-6 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <TelecallerPerformanceCard />
            </div>
            <div className="xl:col-span-5">
              <MonthlyAdmissionTrendCard />
            </div>
          </div>

          {/* Recent Leads (8) & Today's Follow-ups (4) */}
          <div className="grid gap-6 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <RecentLeadsTable recentLeads={data?.tables?.recentLeads} />
            </div>
            <div className="xl:col-span-4">
              <FollowUpsCard followups={data?.tables?.followups} />
            </div>
          </div>

          {/* Pending Actions (4) & Today's Admission Summary (8) */}
          <div className="grid gap-6 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <PendingActionsCard 
                overdueCount={data?.tables?.followups?.overdue?.data?.length || 0}
                unassignedCount={data?.stats?.find((s) => s.title === "Pending Assign")?.value || 0}
                verificationCount={3}
                callbacksTodayCount={data?.tables?.followups?.upcoming?.data?.length || 0}
              />
            </div>
            <div className="xl:col-span-8">
              <AdmissionSummaryCard />
            </div>
          </div>
        </>
      )}
      </ContentSection>
    </PageContainer>
  );
}