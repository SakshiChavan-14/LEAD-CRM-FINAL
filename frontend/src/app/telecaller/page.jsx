"use client";

import { useState, useEffect } from "react";
import { useTelecallerDashboard } from "@/features/telecaller/hooks/useTelecallerDashboard";
import { useVoice } from "@/features/telecaller/voice/context/VoiceProvider";

// Header
import DashboardHeader from "@/features/telecaller/dashboard/components/DashboardHeader";

// KPI
import KPISection from "@/features/telecaller/dashboard/components/KPISection";
import TodaysFocus from "@/features/telecaller/dashboard/components/TodaysFocus";

// Actions
import NextCallsCard from "@/features/telecaller/calls/components/NextCallsCard";

// Pipeline & Analytics
import PipelineSection from "@/features/telecaller/dashboard/components/PipelineSection";
import WeeklyPerformance from "@/features/telecaller/dashboard/components/WeeklyPerformance";

// Followups & Activity
import UpcomingFollowups from "@/features/telecaller/followups/components/UpcomingFollowups";
import RecentActivity from "@/features/telecaller/calls/components/RecentActivity";

// Advanced Analytics (NEW)
import TelecallerAdvancedAnalytics from "@/features/telecaller/dashboard/components/analytics/TelecallerAdvancedAnalytics";

// Modals
import LogCallModal from "@/features/telecaller/calls/components/LogCallModal";

import { useTelecallerLeads } from "@/features/telecaller/hooks/useMyLeads";

export default function TelecallerDashboard() {
  const { data: dashboardData, isLoading: dashboardLoading, error } = useTelecallerDashboard();
  const { data: leadsData, isLoading: leadsLoading } = useTelecallerLeads({}, 0, 100);
  
  const isLoading = dashboardLoading || leadsLoading;
  const [isLogCallOpen, setIsLogCallOpen] = useState(false);
  const [selectedEnquiryNo, setSelectedEnquiryNo] = useState(null);
  
  const { postCallEnquiryNo, setPostCallEnquiryNo } = useVoice();

  // If a call just ended, open the log call modal automatically
  useEffect(() => {
    if (postCallEnquiryNo) {
      setSelectedEnquiryNo(postCallEnquiryNo);
      setIsLogCallOpen(true);
      setPostCallEnquiryNo(null);
    }
  }, [postCallEnquiryNo, setPostCallEnquiryNo]);

  const handleCloseLogCall = () => {
    setIsLogCallOpen(false);
    setSelectedEnquiryNo(null);
  };

  // If there's a hard error loading the whole dashboard (e.g. 500)
  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-100 font-outfit">
        Failed to load dashboard data. Please refresh.
      </div>
    );
  }

  return (
    <div 
      className="bg-[#FFFFFF] min-h-screen font-outfit" 
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 lg:py-8 space-y-6 animate-in fade-in duration-500">
        {/* ── HEADER SECTION ────────────────────────────────────────────────── */}
        <DashboardHeader isLoading={isLoading} summary={dashboardData?.summary} />

        {/* ── KPI GRID (6 Cols) ─────────────────────────────────────────────── */}
        <KPISection 
          isLoading={isLoading} 
          summary={dashboardData?.summary} 
        />

        {/* ── CONTENT GRID 1 (3 Cols) ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr] gap-6 items-stretch">
          <NextCallsCard 
            isLoading={isLoading} 
            nextCalls={dashboardData?.nextCalls} 
            onLogCall={(enquiryNo) => {
              setSelectedEnquiryNo(enquiryNo);
              setIsLogCallOpen(true);
            }} 
          />
          <TodaysFocus 
            isLoading={isLoading} 
            focus={dashboardData?.todaysFocus} 
            leads={leadsData?.leads}
          />
          <UpcomingFollowups 
            isLoading={isLoading} 
            followups={dashboardData?.nextCalls}
            leads={leadsData?.leads}
          />
        </div>

        {/* ── CONTENT GRID 2 (3 Cols) ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          <PipelineSection 
            isLoading={isLoading} 
            pipeline={dashboardData?.pipeline} 
          />
          <WeeklyPerformance 
            isLoading={isLoading} 
            performance={dashboardData?.performance} 
            summary={dashboardData?.summary}
          />
          <RecentActivity 
            isLoading={isLoading} 
            activities={dashboardData?.activities} 
          />
        </div>

        {/* ── ADVANCED ANALYTICS (NEW) ────────────────────────────────────── */}
        <TelecallerAdvancedAnalytics 
          dashboardData={dashboardData}
          leadsData={leadsData}
          isLoading={isLoading}
        />

        {/* ── MODALS ────────────────────────────────────────────────────────── */}
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