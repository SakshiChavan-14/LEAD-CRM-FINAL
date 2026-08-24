"use client";

import { useMemo } from "react";
import { useCallReportsSummary, useTelecallerCallLogs } from "@/features/callReports/hooks/useCallReports";
import { useTelecallerTimeline, useTelecallerFollowups } from "@/features/reports/hooks/useReportsQueries";
import useTelecallerDashboard from "@/features/users/hooks/useTelecallerDashboard";

const toNumber = (v) => {
  if (v === undefined || v === null || v === "" || v === "--" || v === "—") return 0;
  const clean = String(v).replace(/[^0-9.]/g, "");
  const n = Number(clean);
  return isNaN(n) ? 0 : n;
};

/**
 * Single source of truth for telecaller detail data.
 *
 * Checks callReports performance summary. If database contains real data,
 * maps parameters directly to maintain 100% consistent details page and PDF.
 * If database is empty, falls back on a zeroed state.
 */
export function useTelecallerReport(id, range = "this-month", options = {}) {
  // Map date range to fromDate / toDate
  const { fromDate, toDate } = useMemo(() => {
    const end = new Date();
    let start = new Date();
    if (range === "last-month") {
      start.setMonth(start.getMonth() - 1);
    } else if (range === "last-3-months") {
      start.setMonth(start.getMonth() - 3);
    } else {
      // this month
      start.setDate(1);
    }
    return {
      fromDate: start.toISOString().split("T")[0],
      toDate: end.toISOString().split("T")[0],
    };
  }, [range]);

  const { data: telecallersData, isLoading: isSummaryLoading, error } = useCallReportsSummary({
    dateFrom: fromDate,
    dateTo: toDate
  }, 0, 100, options);

  // We need to resolve the empId first to pass to other queries.
  const resolvedEmpId = useMemo(() => {
    const list = telecallersData?.content || telecallersData?.users || (Array.isArray(telecallersData) ? telecallersData : []);
    const matched = list.find((t) => 
      String(t.userId || "").toLowerCase() === String(id).toLowerCase() ||
      String(t.empId || "").toLowerCase() === String(id).toLowerCase() ||
      String(t.id || "").toLowerCase() === String(id).toLowerCase()
    );
    return matched?.empId || matched?.userId || matched?.id || id;
  }, [telecallersData, id]);

  const { data: callsData, isLoading: isCallsLoading } = useTelecallerCallLogs(
    resolvedEmpId,
    {},
    0,
    1000
  );

  const { data: followupsData, isLoading: isFollowupsLoading } = useTelecallerFollowups(
    resolvedEmpId,
    "ALL",
    0,
    50
  );

  const { data: timelineData, isLoading: isTimelineLoading } = useTelecallerTimeline(
    resolvedEmpId,
    0,
    50
  );

  const { data: dashboardData, isLoading: isDashboardLoading } = useTelecallerDashboard(resolvedEmpId);

  const isLoading = isSummaryLoading || isCallsLoading || isFollowupsLoading || isTimelineLoading || isDashboardLoading;

  const data = useMemo(() => {
    const telecallerList = telecallersData?.content || telecallersData?.users || (Array.isArray(telecallersData) ? telecallersData : []);

    // Find the telecaller in the real list by matching id or empId or userId
    const realTc = telecallerList.find((t) => 
      String(t.userId || "").toLowerCase() === String(id).toLowerCase() ||
      String(t.empId || "").toLowerCase() === String(id).toLowerCase() ||
      String(t.id || "").toLowerCase() === String(id).toLowerCase()
    );

    const rawCalls = Array.isArray(callsData?.content) ? callsData.content : Array.isArray(callsData) ? callsData : [];

    // Aggregate Source Performance, Course Distribution, and Monthly Trend from raw calls
    const sourceMap = {};
    const courseMap = {};
    const trendMap = {};

    rawCalls.forEach(c => {
      // Source Aggregation
      const src = c.source || c.leadSource || "Direct";
      const isConversion = String(c.outcome || c.callOutcome || "").toLowerCase().includes("admission") ||
                           String(c.outcome || c.callOutcome || "").toLowerCase().includes("convert") ||
                           String(c.outcome || c.callOutcome || "").toLowerCase().includes("complete");

      sourceMap[src] = sourceMap[src] || { source: src, leads: 0, conversions: 0 };
      sourceMap[src].leads += 1;
      if (isConversion) {
        sourceMap[src].conversions += 1;
      }

      // Course Aggregation
      const crs = c.course || c.leadCourse || "N/A";
      courseMap[crs] = courseMap[crs] || { course: crs, count: 0 };
      courseMap[crs].count += 1;

      // Trend Aggregation
      const dateStr = c.callDateTime || c.created_at || c.callTime || c.createdAt;
      if (dateStr) {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          const monthLabel = date.toLocaleString("en-US", { month: "short" });
          const isInterested = String(c.studentOpinion || c.opinion || "").toLowerCase() === "interested" ||
                               String(c.outcome || c.callOutcome || "").toLowerCase().includes("interest");
          
          trendMap[monthLabel] = trendMap[monthLabel] || { month: monthLabel, calls: 0, interested: 0, admissions: 0 };
          trendMap[monthLabel].calls += 1;
          if (isInterested) trendMap[monthLabel].interested += 1;
          if (isConversion) trendMap[monthLabel].admissions += 1;
        }
      }
    });

    const sourcePerformance = Object.values(sourceMap);
    const courseDistribution = Object.values(courseMap);
    const monthlyTrend = Object.values(trendMap).reverse(); // Reverse to keep chronological order if sorted

    const profile = dashboardData?.profile || {};
    const tcName = profile.name || realTc?.name || realTc?.empName || "Telecaller";
    const tcEmpId = profile.empId || realTc?.userId || realTc?.empId || realTc?.id || id;

    if (realTc || dashboardData?.profile || dashboardData?.kpi) {
      const calls = toNumber(realTc?.totalCalls ?? realTc?.calls ?? dashboardData?.kpi?.callsThisMonth ?? rawCalls.length);
      const connected = toNumber(realTc?.connectedCalls ?? realTc?.connected ?? dashboardData?.callOutcomes?.find(o => o.name === "CONNECTED")?.value);
      const interested = toNumber(
        realTc?.interestedLeads ?? realTc?.interested ??
        dashboardData?.leadPipeline?.find(p => p.stage === "HOT" || p.stage === "INTERESTED")?.count ??
        dashboardData?.assignedLeads?.filter(l => l.status === "HOT" || l.temperature === "HOT" || l.stage === "HOT").length
      );
      const followups = toNumber(
        realTc?.followupsCount ?? realTc?.followups ??
        dashboardData?.kpi?.pendingFollowUps ?? dashboardData?.workload?.pendingFollowUps ??
        (Array.isArray(followupsData?.items) ? followupsData.items.length : Array.isArray(followupsData) ? followupsData.length : 0)
      );
      const admissions = toNumber(realTc?.totalAdmissions ?? realTc?.admissions ?? dashboardData?.kpi?.convertedLeads);
      const conversion = calls > 0 ? ((admissions / calls) * 100).toFixed(1) + "%" : "0.0%";

      // ── Follow-ups Fallback Logic ──────────────────────────────────
      let mappedFollowups = (followupsData?.items || followupsData?.content || (Array.isArray(followupsData) ? followupsData : [])).map(f => ({
        lead: f.studentName || f.student || f.name || f.leadName || "Student",
        course: f.course || f.programme || "N/A",
        due: f.scheduledTime ? `${f.scheduledDate} ${f.scheduledTime}` : (f.scheduledDate || f.followupDate || f.date || "Today")
      }));

      if (mappedFollowups.length === 0) {
        const followupsFromCalls = rawCalls
          .filter(c => c.nextCallDate || c.scheduledDate || c.followupDate || c.scheduledTime || String(c.outcome || c.callOutcome || "").toUpperCase().includes("FOLLOW"))
          .map(c => ({
            lead: c.leadName || c.name || c.studentName || "Student",
            course: c.course || c.leadCourse || "N/A",
            due: c.nextCallDate 
              ? (new Date(c.nextCallDate).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }))
              : (c.scheduledTime ? `${c.scheduledDate} ${c.scheduledTime}` : (c.scheduledDate || c.followupDate || "Scheduled"))
          }));

        const followupsFromDashboard = (dashboardData?.followups || dashboardData?.todayFollowups || dashboardData?.nextCalls || []).map(f => ({
          lead: f.studentName || f.student || f.name || f.leadName || "Student",
          course: f.course || f.programme || "N/A",
          due: f.scheduledTime ? `${f.scheduledDate} ${f.scheduledTime}` : (f.scheduledDate || f.time || "Scheduled")
        }));

        mappedFollowups = followupsFromCalls.length > 0 ? followupsFromCalls : followupsFromDashboard;
      }

      // ── Timeline Fallback Logic ────────────────────────────────────
      let mappedTimeline = (timelineData?.items || timelineData?.content || (Array.isArray(timelineData) ? timelineData : [])).map(event => {
        const typeNorm = String(event.type || event.eventType || event.event_type || "").toUpperCase();
        let timelineType = event.type || "note";
        if (typeNorm.includes("CALL") || typeNorm.includes("INTERACTION")) timelineType = "call";
        if (typeNorm.includes("FOLLOWUP") || typeNorm.includes("FOLLOW_UP")) timelineType = "followup";
        if (typeNorm.includes("ADMISSION") || typeNorm.includes("CONVERSION") || typeNorm.includes("CONVERTED")) timelineType = "conversion";
        if (typeNorm.includes("INTERESTED") || typeNorm.includes("OPINION")) timelineType = "interested";

        return {
          id: event.id,
          type: timelineType.toLowerCase(),
          title: event.title || "Action",
          description: event.description || "",
          createdAt: event.createdAt
        };
      });

      if (mappedTimeline.length === 0 && rawCalls.length > 0) {
        mappedTimeline = rawCalls.map((c, i) => {
          const leadName = c.leadName || c.name || c.studentName || "Lead";
          const outcome = c.outcome || c.callOutcome || "Connected";
          const notes = c.telecallerNotes || c.notes || c.remarks || c.comment || "";
          const opinion = c.studentOpinion || c.opinion || "";
          
          let type = "call";
          if (opinion.toLowerCase().includes("interest")) type = "interested";
          if (outcome.toLowerCase().includes("follow") || c.nextCallDate) type = "followup";
          if (outcome.toLowerCase().includes("admission") || outcome.toLowerCase().includes("convert")) type = "conversion";

          const formattedDate = c.createdAt || c.callDateTime || c.callTime;
          const timeStr = formattedDate ? new Date(formattedDate).toLocaleString("en-IN", {
            day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
          }) : "Today";

          return {
            id: c.callId || c.interactionId || c.id || `call-${i}`,
            type,
            title: `${type === "interested" ? "Marked Interested: " : type === "followup" ? "Scheduled Follow-up: " : "Outbound Call: "}${leadName}`,
            description: notes || `Call ${outcome} • ${opinion || c.course || "No notes recorded"} (${timeStr})`,
            createdAt: formattedDate
          };
        });
      }

      return {
        telecaller: {
          id: tcEmpId,
          empId: tcEmpId,
          name: tcName,
          calls: calls,
          admissions: admissions,
          conversion: toNumber(realTc.conversionRate || realTc.conversion)
        },
        kpi: {
          callsMade:    { value: calls },
          connected:    { value: connected },
          interested:   { value: interested },
          followups:    { value: followups },
          admissions:   { value: admissions },
          conversion:   { value: conversion },
        },
        monthlyTrend,
        funnel: [
          { name: "Assigned", value: calls },
          { name: "Connected", value: connected },
          { name: "Interested", value: interested },
          { name: "Follow-up", value: followups },
          { name: "Converted", value: admissions }
        ],
        sourcePerformance,
        courseDistribution,
        recentCalls: rawCalls.slice(0, 5).map(c => ({
          lead: c.leadName || c.studentName || "Student",
          course: c.course || "N/A",
          duration: c.duration || "00:00",
          outcome: c.outcome || c.callOutcome || "Connected",
          time: c.callTime || (c.callDateTime ? new Date(c.callDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Today")
        })),
        followups: mappedFollowups,
        timeline: mappedTimeline,
      };
    }

    // Zeroed State if not found
    return {
      telecaller: {
        id: tcEmpId,
        empId: tcEmpId,
        name: tcName,
        calls: 0,
        admissions: 0,
        conversion: 0
      },
      kpi: {
        callsMade:    { value: 0 },
        connected:    { value: 0 },
        interested:   { value: 0 },
        followups:    { value: 0 },
        admissions:   { value: 0 },
        conversion:   { value: "0.0%" },
      },
      monthlyTrend:        [],
      funnel: [
        { name: "Assigned", value: 0 },
        { name: "Connected", value: 0 },
        { name: "Interested", value: 0 },
        { name: "Follow-up", value: 0 },
        { name: "Converted", value: 0 }
      ],
      sourcePerformance:   [],
      courseDistribution:  [],
      recentCalls: [],
      followups: [],
      timeline: [],
    };
  }, [id, telecallersData, callsData, followupsData, timelineData, dashboardData]);

  return { data, isLoading, error };
}
