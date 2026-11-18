"use client";

import { useState, useMemo } from "react";
import { useTelecallerDashboard } from "@/features/telecaller/hooks/useTelecallerDashboard";
import { useTelecallerLeads } from "@/features/telecaller/hooks/useMyLeads";

// Row 1: Header (Welcome + Today's Tasks)
import DashboardHeader from "@/features/telecaller/dashboard/components/DashboardHeader";

// Row 2: 6 KPI Cards
import KPISection from "@/features/telecaller/dashboard/components/KPISection";

// Row 3: Main Analytics (3 Columns: Conversion Insights, Sources, Performance)
import ConversionInsightsCard from "@/features/telecaller/dashboard/components/analytics/ConversionInsightsCard";
import SourceAnalyticsCard from "@/features/telecaller/dashboard/components/analytics/SourceAnalyticsCard";
import MyPerformanceCard from "@/features/telecaller/dashboard/components/MyPerformanceCard";

// Row 4: Bottom Widgets (3 Columns: Recent Activity, Next Best Leads, Upcoming Follow-ups)
import RecentActivity from "@/features/telecaller/calls/components/RecentActivity";
import NextCallsCard from "@/features/telecaller/calls/components/NextCallsCard";
import UpcomingFollowups from "@/features/telecaller/followups/components/UpcomingFollowups";

// Modals
import LogCallModal from "@/features/telecaller/calls/components/LogCallModal";

export default function TelecallerDashboard() {
  const { data: dashboardData, isLoading: dashboardLoading, error } = useTelecallerDashboard();
  const { data: leadsData, isLoading: leadsLoading } = useTelecallerLeads({}, 0, 100);
  
  const isLoading = dashboardLoading || leadsLoading;
  const [isLogCallOpen, setIsLogCallOpen] = useState(false);
  const [selectedEnquiryNo, setSelectedEnquiryNo] = useState(null);
  
  const handleCloseLogCall = () => {
    setIsLogCallOpen(false);
    setSelectedEnquiryNo(null);
  };

  const sourceData = useMemo(() => {
    const leads = leadsData?.leads || [];
    const sMap = {};
    const convertedStatuses = ["ENROLLED", "ADMISSION", "ADMITTED", "CONVERTED", "ADMISSION_DONE"];

    leads.forEach((l) => {
      const source = l.source || l.leadSource || "Unknown";
      const status = (l.status || "").toUpperCase();
      const stage = (l.stage || "").toUpperCase();
      const leadStatus = (l.leadStatus || "").toUpperCase();
      const currentStage = (l.currentStage || "").toUpperCase();

      const isConverted = convertedStatuses.includes(status) ||
                          convertedStatuses.includes(stage) ||
                          convertedStatuses.includes(leadStatus) ||
                          convertedStatuses.includes(currentStage);

      if (!sMap[source]) sMap[source] = { source, total: 0, converted: 0 };
      sMap[source].total += 1;
      if (isConverted) sMap[source].converted += 1;
    });

    return Object.values(sMap);
  }, [leadsData?.leads]);

  const conversionData = useMemo(() => {
    const summary = dashboardData?.summary;
    if (summary) {
      const assigned = summary.assigned || 0;
      const contacted = summary.connected || 0;
      const interested = summary.interested || 0;
      const converted = summary.admissions || 0;
      const followups = summary.followups || 0;
      const conversionRate = assigned > 0 ? Number(((converted / assigned) * 100).toFixed(1)) : 0.0;
      
      return {
        assigned,
        contacted,
        interested,
        followups,
        converted,
        conversionRate
      };
    }

    return {
      assigned: 0,
      contacted: 0,
      interested: 0,
      followups: 0,
      converted: 0,
      conversionRate: 0.0
    };
  }, [dashboardData]);

  // If there's a hard error loading the whole dashboard (e.g. 500)
  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-100 font-outfit">
        Failed to load dashboard data. Please refresh.
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] min-h-screen font-outfit">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 py-6 lg:py-7 space-y-5 animate-in fade-in duration-500">
        
        {/* ── ROW 1: HEADER (Welcome + Today's Tasks) ─────────────────────── */}
        <DashboardHeader 
          isLoading={isLoading} 
          summary={dashboardData?.summary} 
        />

        {/* ── ROW 2: 6 KPI CARDS ──────────────────────────────────────────── */}
        <KPISection 
          isLoading={isLoading} 
          summary={dashboardData?.summary} 
        />

        {/* ── ROW 3: MAIN ANALYTICS (3 Columns: 5 / 4 / 3 cols) ───────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
          <div className="xl:col-span-5 flex flex-col">
            <ConversionInsightsCard 
              isLoading={isLoading} 
              data={conversionData} 
            />
          </div>
          <div className="xl:col-span-4 flex flex-col">
            <SourceAnalyticsCard 
              isLoading={isLoading} 
              data={sourceData} 
            />
          </div>
          <div className="xl:col-span-3 flex flex-col">
            <MyPerformanceCard 
              isLoading={isLoading} 
              summary={dashboardData?.summary} 
            />
          </div>
        </div>

        {/* ── ROW 4: BOTTOM DASHBOARD (3 Equal Columns) ────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
          <div className="flex flex-col">
            <RecentActivity 
              isLoading={isLoading} 
              activities={dashboardData?.activities} 
            />
          </div>
          <div className="flex flex-col">
            <NextCallsCard 
              isLoading={isLoading} 
              nextCalls={dashboardData?.nextCalls} 
              onLogCall={(enquiryNo) => {
                setSelectedEnquiryNo(enquiryNo);
                setIsLogCallOpen(true);
              }} 
            />
          </div>
          <div className="flex flex-col">
            <UpcomingFollowups 
              isLoading={isLoading} 
              followups={dashboardData?.followups || dashboardData?.nextCalls}
              leads={leadsData?.leads}
            />
          </div>
        </div>

        {/* ── MODALS ──────────────────────────────────────────────────────── */}
        {isLogCallOpen && (
          <LogCallModal 
            open={isLogCallOpen} 
            onClose={handleCloseLogCall} 
            enquiryNo={selectedEnquiryNo} 
          />
        )}
      </div>
    </div>
  );
}
