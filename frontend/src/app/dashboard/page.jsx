"use client";

import React, { useMemo } from "react";
import DashboardStats from "@/features/dashboard/components/sections/DashboardStats";
import PipelineChart from "@/features/dashboard/components/widgets/PipelineChart";
import SourceAnalytics from "@/features/dashboard/components/widgets/SourceAnalytics";
import FollowUpsCard from "@/features/dashboard/components/widgets/FollowUpsCard";
import TelecallerPerformanceCard from "@/features/dashboard/components/widgets/TelecallerPerformanceCard";
import MonthlyAdmissionTrendCard from "@/features/dashboard/components/widgets/MonthlyAdmissionTrendCard";
import LeadTemperature from "@/features/dashboard/components/widgets/LeadTemperature";
import ActionRequiredSection from "@/features/dashboard/components/widgets/ActionRequiredSection";
import CallActivityCard from "@/features/dashboard/components/widgets/CallActivityCard";
import ActivityTimeline from "@/features/dashboard/components/widgets/ActivityTimeline";
import TopPerformersList from "@/features/dashboard/components/widgets/TopPerformersList";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import useUsers from "@/features/users/hooks/useUsers";
import { DashboardSkeleton } from "@/components/dashboard-ui/DashboardSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import PageContainer from "@/components/layout/PageContainer";
import { ContentSection } from "@/components/management";

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboardStats();
  const { data: usersData } = useUsers({ size: 1000 });

  const greeting = useMemo(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      return "Good Morning, Admin 👋";
    }
    if (hours >= 12 && hours < 17) {
      return "Good Afternoon, Admin 👋";
    }
    return "Good Evening, Admin 👋";
  }, []);

  const stats = useMemo(() => {
    if (!data?.stats) return [];

    const users = usersData?.users || [];
    const activeTelecallersCount = users.filter(
      u => String(u.role || "").toUpperCase() !== "ADMIN" && String(u.status || "").toUpperCase() === "ACTIVE"
    ).length;

    return data.stats.map(item => {
      if (item.title === "Telecallers") {
        return {
          ...item,
          value: activeTelecallersCount
        };
      }
      return item;
    });
  }, [data, usersData]);

  const cleanNumber = (v) => {
    if (v === undefined || v === null || v === "" || v === "--" || v === "—") return 0;
    const n = Number(String(v).replace(/[^0-9.]/g, ""));
    return isNaN(n) ? 0 : n;
  };

  const { totalLeads, activeLeads, admissions } = useMemo(() => {
    let total = 0;
    let active = 0;
    let adm = 0;

    if (stats && stats.length > 0) {
      const totalCard = stats.find(item => item.title === "Total Leads");
      const activeCard = stats.find(item => item.title === "Active Leads");
      const admissionsCard = stats.find(item => item.title === "Admissions");

      if (totalCard) total = cleanNumber(totalCard.value);
      if (activeCard) active = cleanNumber(activeCard.value);
      if (admissionsCard) adm = cleanNumber(admissionsCard.value);
    }

    return { totalLeads: total, activeLeads: active, admissions: adm };
  }, [stats]);

  const pipelineData = useMemo(() => {
    return data?.charts?.pipeline || [];
  }, [data]);

  const scaledSourceAnalytics = useMemo(() => {
    const raw = data?.charts?.sourceAnalytics || [];
    if (raw.length === 0) return [];
    if (totalLeads === 0) return [];

    const rawSum = raw.reduce((sum, item) => sum + (item.value || 0), 0);
    if (rawSum === 0) return [];

    const factor = totalLeads / rawSum;
    let scaled = raw.map(item => ({
      ...item,
      value: Math.round((item.value || 0) * factor)
    }));

    const scaledSum = scaled.reduce((sum, item) => sum + item.value, 0);
    const diff = totalLeads - scaledSum;
    if (diff !== 0 && scaled.length > 0) {
      let maxIdx = 0;
      for (let i = 1; i < scaled.length; i++) {
        if (scaled[i].value > scaled[maxIdx].value) {
          maxIdx = i;
        }
      }
      scaled[maxIdx].value += diff;
    }
    return scaled;
  }, [data?.charts?.sourceAnalytics, totalLeads]);

  // Derive counts for ActionRequiredSection (Hot, Warm, Cold Leads)
  const hotCount = useMemo(() => {
    return data?.temperature?.hot || 0;
  }, [data]);

  const warmCount = useMemo(() => {
    return data?.temperature?.warm || 0;
  }, [data]);

  const coldCount = useMemo(() => {
    return data?.temperature?.cold || 0;
  }, [data]);

  return (
    <PageContainer size="wide" className="py-6">
      <ContentSection className="space-y-6 pb-12 max-w-[1600px] mx-auto w-full">

        {/* Header with Greeting */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-outfit px-1">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {greeting}
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Here&apos;s what is happening in your CRM today.
            </p>
          </div>
        </header>

        {isLoading ? (
          <DashboardSkeleton />
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <div className="space-y-6">
            {/* 1. Executive KPI Row */}
            <DashboardStats stats={stats} />

            {/* 2. Action Required Row (Hot, Warm, Cold Leads) */}
            <ActionRequiredSection 
              hotCount={hotCount} 
              warmCount={warmCount} 
              coldCount={coldCount}
              isLoading={isLoading} 
            />

            {/* 3. Pipeline & Lead Temperature Row */}
            <div className="grid gap-6 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-7 flex flex-col">
                <PipelineChart pipeline={pipelineData} />
              </div>
              <div className="lg:col-span-5 flex flex-col">
                <LeadTemperature temperatureBreakdown={data?.charts?.temperatureBreakdown || []} />
              </div>
            </div>

            {/* 4. Admission Performance & Lead Sources Row */}
            <div className="grid gap-6 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-7 flex flex-col">
                <MonthlyAdmissionTrendCard />
              </div>
              <div className="lg:col-span-5 flex flex-col">
                <SourceAnalytics sourceAnalytics={scaledSourceAnalytics} />
              </div>
            </div>

            {/* 5. Activity, Call Logs & Followups Row */}
            <div className="grid gap-6 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-4 flex flex-col">
                <CallActivityCard />
              </div>
              <div className="lg:col-span-4 flex flex-col">
                <FollowUpsCard followups={data?.tables?.followups} />
              </div>
              <div className="lg:col-span-4 flex flex-col">
                <ActivityTimeline timeline={data?.timeline || {}} />
              </div>
            </div>

            {/* 6. Telecaller Performance (65-70%) & Top Performers (30-35%) Row */}
            <div className="grid gap-6 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-8 flex flex-col">
                <TelecallerPerformanceCard />
              </div>
              <div className="lg:col-span-4 flex flex-col">
                <TopPerformersList />
              </div>
            </div>
          </div>
        )}
      </ContentSection>
    </PageContainer>
  );
}