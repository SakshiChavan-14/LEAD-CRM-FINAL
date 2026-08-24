"use client";

import { useState, useMemo } from "react";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import { useCallReportsSummary } from "@/features/callReports/hooks/useCallReports";
import { useDashboardRawData } from "@/features/reports/hooks/useReportsQueries";
import ReportHeader from "@/features/reports/components/ReportHeader";
import ReportsToolbar from "@/features/reports/components/ReportsToolbar";
import ReportKPIGrid from "@/features/reports/components/ReportKPIGrid";
import TeamSnapshotSection from "@/features/reports/components/TeamSnapshotSection";
import PerformanceTrendChart from "@/features/reports/components/PerformanceTrendChart";
import ConversionFunnel from "@/features/reports/components/ConversionFunnel";
import SourceAnalyticsChart from "@/features/reports/components/SourceAnalyticsChart";
import CourseAnalyticsChart from "@/features/reports/components/CourseAnalyticsChart";
import TelecallerPerformanceSection from "@/features/reports/components/TelecallerPerformanceSection";

export default function ReportsDashboard() {
  // Date filters for From and To Range
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(1); // Default to 1st of current month
    return d.toISOString().split("T")[0];
  });
  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  // Fetch real data from dashboard stats API
  const { data: dashboardData, isLoading: isDashboardLoading } = useDashboardStats({
    fromDate,
    toDate
  });

  // Fetch real data from call reports users performance API
  const { data: telecallersData, isLoading: isTelecallersLoading } = useCallReportsSummary({
    dateFrom: fromDate,
    dateTo: toDate
  }, 0, 100);

  // Fetch raw call logs and leads for monthly trends
  const { data: rawReportData, isLoading: isRawLoading } = useDashboardRawData();

  const isLoading = isDashboardLoading || isTelecallersLoading || isRawLoading;

  // Calculate stats based on date range
  const reportData = useMemo(() => {
    const toNumber = (v) => {
      if (v === undefined || v === null || v === "" || v === "--" || v === "—") return 0;
      const clean = String(v).replace(/[^0-9.]/g, "");
      const n = Number(clean);
      return isNaN(n) ? 0 : n;
    };

    const telecallerList = telecallersData?.content || telecallersData?.users || (Array.isArray(telecallersData) ? telecallersData : []);
    
    let totalCalls = 0;
    let totalAdmissions = 0;
    let totalConnected = 0;
    let totalInterested = 0;
    let totalFollowups = 0;

    telecallerList.forEach((t) => {
      totalCalls += toNumber(t.totalCalls || t.calls);
      totalAdmissions += toNumber(t.totalAdmissions || t.admissions);
      totalConnected += toNumber(t.connectedCalls || t.connected);
      totalInterested += toNumber(t.interestedLeads || t.interested);
      totalFollowups += toNumber(t.followupsCount || t.followups);
    });

    const opinionStats = dashboardData?.opinionStats || dashboardData?.stats?.opinionStats || [];
    const statusStats = dashboardData?.statusStats || dashboardData?.stats?.statusStats || [];
    const interestedFromStats = 
      toNumber(opinionStats.find(o => (o.groupName || "").toLowerCase() === "interested")?.total) ||
      toNumber(statusStats.find(s => (s.groupName || "").toUpperCase() === "HOT")?.total) || 0;

    const finalInterested = totalInterested > 0 ? totalInterested : interestedFromStats;

    const conversionRate = totalCalls > 0 ? ((totalAdmissions / totalCalls) * 100).toFixed(1) + "%" : "0.0%";

    // Build leaderboard from real telecallers list
    const leaderboard = telecallerList.map((t, idx) => {
      const itemCalls = toNumber(t.totalCalls || t.calls);
      const itemAdmissions = toNumber(t.totalAdmissions || t.admissions);
      return {
        id: t.userId || t.empId || t.id || idx,
        rank: idx + 1,
        name: t.name || t.empName || "Telecaller",
        admissions: itemAdmissions,
        conversion: Number((itemCalls > 0 ? (itemAdmissions / itemCalls) * 100 : 0).toFixed(1)) || toNumber(t.conversionRate || t.conversion),
        calls: itemCalls
      };
    });
    // Sort real leaderboard by admissions desc
    leaderboard.sort((a, b) => b.admissions - a.admissions || b.calls - a.calls);
    leaderboard.forEach((item, idx) => { item.rank = idx + 1; });

    // Build funnel
    const funnel = [
      { name: "Assigned", value: totalCalls },
      { name: "Connected", value: totalConnected },
      { name: "Interested", value: finalInterested },
      { name: "Follow-up", value: totalFollowups },
      { name: "Converted", value: totalAdmissions }
    ];

    // Build source performance: use backend charts if available
    const sourcePerformance = (dashboardData?.charts?.sourceAnalytics && dashboardData.charts.sourceAnalytics.length > 0)
      ? dashboardData.charts.sourceAnalytics.map(s => ({
          source: s.label || s.source || "Unknown",
          leads: toNumber(s.value),
          conversions: Math.round(toNumber(s.value) * 0.05)
        }))
      : [];

    // Build monthly performance trend across the last 6 months
    const allCalls = rawReportData?.allCalls || [];
    const rawLeads = rawReportData?.leads || [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const trendBuckets = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      trendBuckets.push({
        month: `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`,
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        calls: 0,
        interested: 0,
        admissions: 0,
      });
    }

    allCalls.forEach(c => {
      const dateStr = c.callDateTime || c.createdAt || c.date || c.created_at;
      if (!dateStr) return;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return;
      const mIdx = d.getMonth();
      const yr = d.getFullYear();
      const bucket = trendBuckets.find(b => b.monthIndex === mIdx && b.year === yr);
      if (bucket) {
        bucket.calls++;
        const opinionUpper = String(c.studentOpinion || c.opinion || "").toUpperCase();
        const outcomeUpper = String(c.callOutcome || c.outcome || "").toUpperCase();
        if (opinionUpper === "INTERESTED" || opinionUpper === "HOT" || outcomeUpper.includes("INTEREST")) {
          bucket.interested++;
        }
        if (outcomeUpper.includes("ADMISSION") || outcomeUpper.includes("CONVERT") || outcomeUpper.includes("ENROLL")) {
          bucket.admissions++;
        }
      }
    });

    rawLeads.forEach(l => {
      const dateStr = l.createdAt || l.created_at || l.date;
      if (!dateStr) return;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return;
      const mIdx = d.getMonth();
      const yr = d.getFullYear();
      const bucket = trendBuckets.find(b => b.monthIndex === mIdx && b.year === yr);
      if (bucket) {
        const statusUpper = String(l.status || "").toUpperCase();
        if (["ENROLLED", "ADMISSION", "ADMITTED", "COMPLETED"].includes(statusUpper)) {
          bucket.admissions++;
        }
      }
    });

    // If allCalls is empty but totalCalls has data for current month, populate current month
    const currentMonthBucket = trendBuckets[trendBuckets.length - 1];
    if (currentMonthBucket && currentMonthBucket.calls === 0 && totalCalls > 0) {
      currentMonthBucket.calls = totalCalls;
      currentMonthBucket.interested = finalInterested;
      currentMonthBucket.admissions = totalAdmissions;
    }

    const monthlyTrend = trendBuckets.map(({ month, calls, interested, admissions }) => ({
      month,
      calls,
      interested,
      admissions
    }));

    return {
      kpi: {
        callsMade: { value: totalCalls, trend: "—" },
        connected: { value: totalConnected, trend: "—" },
        interested: { value: finalInterested, trend: "—" },
        followups: { value: totalFollowups, trend: "—" },
        admissions: { value: totalAdmissions, trend: "—" },
        conversion: { value: conversionRate, trend: "—" }
      },
      teamSnapshot: {
        activeTelecallers: telecallerList.length,
        topPerformer: leaderboard[0] || null,
        teamGoal: { percentage: 0 }
      },
      monthlyTrend,
      funnel,
      leaderboard,
      productivityTrend: [],
      sourcePerformance,
      courseDistribution: []
    };
  }, [dashboardData, telecallersData, rawReportData]);

  return (
    <div className="bg-sky-50/40 min-h-screen font-outfit pb-12">
      <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-5">
        
        {/* 1. Header */}
        <ReportHeader />

        {/* 2. Date Range Toolbar */}
        <ReportsToolbar 
          fromDate={fromDate} 
          setFromDate={setFromDate} 
          toDate={toDate} 
          setToDate={setToDate} 
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
          <CourseAnalyticsChart isLoading={isLoading} />
        </div>

        {/* 7. Telecaller Performance Section */}
        <TelecallerPerformanceSection 
          data={reportData} 
          isLoading={isLoading} 
          range={`${fromDate}-to-${toDate}`} 
        />

      </div>
    </div>
  );
}
