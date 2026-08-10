"use client";

import { useState, useMemo } from "react";
import { useReportsMock } from "@/features/reports/hooks/useReportsMock";
import ReportHeader from "@/features/reports/components/ReportHeader";
import ReportsToolbar from "@/features/reports/components/ReportsToolbar";
import ReportKPIGrid from "@/features/reports/components/ReportKPIGrid";
import TeamSnapshotSection from "@/features/reports/components/TeamSnapshotSection";
import PerformanceTrendChart from "@/features/reports/components/PerformanceTrendChart";
import ConversionFunnel from "@/features/reports/components/ConversionFunnel";
import SourceAnalyticsChart from "@/features/reports/components/SourceAnalyticsChart";
import CourseAnalyticsChart from "@/features/reports/components/CourseAnalyticsChart";
import TelecallerPerformanceSection from "@/features/reports/components/TelecallerPerformanceSection";
import { reportsMockData } from "@/features/reports/data/reportsMockData";

function getReportByRange(range, team, reports) {
  if (!reports) return null;
  switch (range) {
    case "last-month":
      return reports.lastMonth;
    case "last-3-months":
      return reports.last3Months;
    default:
      return reports.thisMonth;
  }
}

export default function ReportsDashboard() {
  const { data: reports, isLoading } = useReportsMock();
  const [range, setRange] = useState("this-month");
  const [team, setTeam] = useState("all");

  const reportData = useMemo(() => {
    return getReportByRange(range, team, reports);
  }, [range, team, reports]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-outfit pb-12">
      <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-5">
        
        {/* 1. Header */}
        <ReportHeader lastUpdatedAt={reportsMockData.lastUpdatedAt} />

        {/* 2. Toolbar */}
        <ReportsToolbar 
          range={range} 
          setRange={setRange} 
          team={team} 
          setTeam={setTeam} 
          isLoading={isLoading} 
        />

        {/* 3. KPI Grid */}
        <ReportKPIGrid data={reportData?.kpi} isLoading={isLoading} />

        {/* 4. Team Snapshot */}
        <TeamSnapshotSection data={reportData?.teamSnapshot} isLoading={isLoading} />

        {/* 5. Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <PerformanceTrendChart data={reportData?.monthlyTrend} isLoading={isLoading} />
          <ConversionFunnel data={reportData?.funnel} isLoading={isLoading} />
        </div>

        {/* 6. Source Analytics & Course Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SourceAnalyticsChart data={reportData?.sourcePerformance} isLoading={isLoading} />
          <CourseAnalyticsChart data={reportData?.courseDistribution} isLoading={isLoading} />
        </div>

        {/* 7. Telecaller Performance Section */}
        <TelecallerPerformanceSection data={reportData} isLoading={isLoading} />

      </div>
    </div>
  );
}
