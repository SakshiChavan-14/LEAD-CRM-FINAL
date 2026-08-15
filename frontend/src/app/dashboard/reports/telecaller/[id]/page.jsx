"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { useTelecallerReport } from "@/features/reports/hooks/useTelecallerReport";
import TelecallerHeader        from "@/features/reports/components/detail/TelecallerHeader";
import TelecallerKPIGrid       from "@/features/reports/components/detail/TelecallerKPIGrid";
import TelecallerAnalyticsGrid from "@/features/reports/components/detail/TelecallerAnalyticsGrid";
import TelecallerActivityGrid  from "@/features/reports/components/detail/TelecallerActivityGrid";
import ErrorState from "@/components/ui/ErrorState";

export default function TelecallerDetailPage({ params }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const range = searchParams.get("range") || "this-month";

  const { data, isLoading, error } = useTelecallerReport(id, range);

  if (error) {
    return (
      <PageContainer size="wide" className="py-8">
        <ErrorState
          title="Failed to load telecaller data"
          message={error?.message || "Something went wrong. Please try again."}
          onRetry={() => window.location.reload()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer size="wide" className="py-6">
      <div className="max-w-[1600px] mx-auto space-y-5 pb-12 font-outfit">

        {/* 1. Header — back button, avatar, name, rank, export */}
        <TelecallerHeader
          telecaller={data?.telecaller}
          id={id}
          range={range}
        />

        {/* 2. KPI Grid — 6 cards */}
        <TelecallerKPIGrid kpi={data?.kpi} isLoading={isLoading} />

        {/* 3. Analytics Charts — Trend, Funnel, Source, Course */}
        <TelecallerAnalyticsGrid
          monthlyTrend={data?.monthlyTrend}
          funnel={data?.funnel}
          sourcePerformance={data?.sourcePerformance}
          courseDistribution={data?.courseDistribution}
          isLoading={isLoading}
        />

        {/* 4. Activity — Recent Calls + Follow-ups + Activity Timeline */}
        <TelecallerActivityGrid
          recentCalls={data?.recentCalls}
          followups={data?.followups}
          timeline={data?.timeline}
          isLoading={isLoading}
        />

      </div>
    </PageContainer>
  );
}
