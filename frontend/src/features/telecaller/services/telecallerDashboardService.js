import { telecallerLeadService } from "./telecallerLeadService";
import { telecallerFollowupService } from "./telecallerFollowupService";
import { callHistoryService } from "../voice/services/callHistoryService";
import { computeVoiceAnalytics, computeWeeklyPerformance, formatRecentActivity } from "../utils/telecallerMetrics";
import axiosInstance from "@/lib/axios";
import API_ENDPOINTS from "@/utils/apiEndpoints";

export const telecallerDashboardService = {
  getDashboardV2: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.TELECALLER.DASHBOARD_V2);
      const v2Data = response.data?.data || response.data || {};
      const baseDashboard = await telecallerDashboardService.getDashboard(v2Data.targets);
      
      // Override callsRemaining with the target value directly
      if (baseDashboard?.todaysFocus && v2Data.targets) {
        baseDashboard.todaysFocus.callsRemaining = v2Data.targets.callsRemainingToday ?? 0;
      }

      const defaultPerformance = {
        daily: [
          { name: "Calls", achieved: baseDashboard?.summary?.callsToday ?? 0, target: v2Data.targets?.dailyCallTarget ?? 50 }
        ],
        weekly: [
          { name: "Calls", achieved: baseDashboard?.weeklyPerformance?.calls?.current ?? 0, target: v2Data.targets?.weeklyCallTarget ?? 350 },
          { name: "Interested", achieved: baseDashboard?.weeklyPerformance?.interested?.current ?? 0, target: v2Data.targets?.weeklyInterestedTarget ?? 100 },
          { name: "Admissions", achieved: baseDashboard?.weeklyPerformance?.admissions?.current ?? 0, target: v2Data.targets?.weeklyAdmissionTarget ?? 15 }
        ],
        monthly: [
          { name: "Calls", achieved: baseDashboard?.summary?.callsToday ?? 0, target: (v2Data.targets?.dailyCallTarget ?? 50) * 20 }
        ]
      };

      const hasPerformanceData = v2Data.performance && 
                                 Array.isArray(v2Data.performance.weekly) && 
                                 v2Data.performance.weekly.length > 0;

      return {
        ...baseDashboard,
        performance: hasPerformanceData ? v2Data.performance : defaultPerformance,
        targets: v2Data.targets || null,
      };
    } catch (error) {
      console.error("Dashboard V2 load failed:", error);
      const baseDashboard = await telecallerDashboardService.getDashboard();
      
      const defaultPerformance = {
        daily: [
          { name: "Calls", achieved: baseDashboard?.summary?.callsToday ?? 0, target: 50 }
        ],
        weekly: [
          { name: "Calls", achieved: baseDashboard?.weeklyPerformance?.calls?.current ?? 0, target: 350 },
          { name: "Interested", achieved: baseDashboard?.weeklyPerformance?.interested?.current ?? 0, target: 100 },
          { name: "Admissions", achieved: baseDashboard?.weeklyPerformance?.admissions?.current ?? 0, target: 15 }
        ],
        monthly: [
          { name: "Calls", achieved: baseDashboard?.summary?.callsToday ?? 0, target: 1000 }
        ]
      };

      return {
        ...baseDashboard,
        performance: defaultPerformance,
        targets: null,
      };
    }
  },

  getDashboard: async (targets) => {
    try {
      // 1. Fetch data concurrently
      const [leadsData, followupsData, callsData] = await Promise.all([
        telecallerLeadService.getMyLeads({ size: 100 }).catch(() => ({ leads: [] })),
        telecallerFollowupService.getFollowups({ tab: "all" }).catch(() => []),
        callHistoryService.getCallHistory().catch(() => [])
      ]);

      const leads = Array.isArray(leadsData?.leads) 
        ? leadsData.leads 
        : (Array.isArray(leadsData?.content) 
            ? leadsData.content 
            : (Array.isArray(leadsData) ? leadsData : []));
      const followups = Array.isArray(followupsData) ? followupsData : [];
      const calls = Array.isArray(callsData) ? callsData : [];

      // 2. Compute metrics from single source of truth
      const voiceAnalytics = computeVoiceAnalytics(calls);
      
      const todayStr = new Date().toISOString().split("T")[0];

      const interestedCount = leads.filter(l => 
        (l.status || "").toUpperCase() === "INTERESTED" || 
        (l.stage || "").toUpperCase() === "INTERESTED" || 
        (l.leadStatus || "").toUpperCase() === "INTERESTED" ||
        (l.opinion || "").toUpperCase().includes("INTERESTED") ||
        (l.opinion || "").toUpperCase().includes("HOT") ||
        (l.status || "").toUpperCase() === "HOT"
      ).length;
      const admissionsCount = leads.filter(l => 
        (l.status || "").toUpperCase() === "ENROLLED" || 
        (l.stage || "").toUpperCase() === "ADMISSION" || 
        (l.leadStatus || "").toUpperCase() === "ENROLLED" ||
        (l.status || "").toUpperCase() === "ADMISSION" ||
        (l.status || "").toUpperCase() === "COMPLETED"
      ).length;

      // 3. Compute dashboard summary
      const totalAssignedLeads = leadsData?.totalItems ?? leadsData?.totalElements ?? leadsData?.total ?? leads.length;
      const summary = {
        assigned: totalAssignedLeads,
        callsToday: voiceAnalytics.callsToday, // Sourced from calls history
        connected: voiceAnalytics.connected, // Sourced from calls history
        interested: interestedCount,
        admissions: admissionsCount,
        goal: 0
      };

      const stageMapping = {
        "Lead In": ["NEW", "LEAD IN", "LEAD_IN", "ENQUIRY"],
        "Contacted": ["CONTACTED", "IN_PROGRESS", "COLD", "WARM"],
        "Interested": ["INTERESTED", "HOT"],
        "Application": ["APPLICATION", "APPLIED"],
        "Documents": ["DOCUMENTS", "DOCUMENT_VERIFICATION"],
        "Admission": ["ENROLLED", "ADMISSION", "ADMITTED", "COMPLETED"]
      };

      const pipeline = Object.entries(stageMapping).map(([stageName, matchingStatuses]) => {
        return {
          stage: stageName,
          count: leads.filter(l => {
            const s1 = (l.status || "").toUpperCase();
            const s2 = (l.stage || "").toUpperCase();
            const s3 = (l.leadStatus || "").toUpperCase();
            const s4 = (l.currentStage || "").toUpperCase();
            
            return matchingStatuses.includes(s1) || 
                   matchingStatuses.includes(s2) || 
                   matchingStatuses.includes(s3) || 
                   matchingStatuses.includes(s4) ||
                   s2 === stageName.toUpperCase() ||
                   s4 === stageName.toUpperCase();
          }).length
        };
      });

      // Cross-reference followups with leads to guarantee student name and details are always resolved
      const mappedFollowups = followups.map(f => {
        const leadId = f.leadId || f.enquiryNo || f.id;
        const leadMatch = leads.find(l => String(l.enquiryNo || l.id) === String(leadId));
        const resolvedName = (f.name && f.name !== "Unknown" ? f.name : null) || 
                             f.studentName || 
                             f.student || 
                             f.leadName || 
                             leadMatch?.name || 
                             leadMatch?.studentName || 
                             leadMatch?.student?.name || 
                             "Student";
        const course = f.course || leadMatch?.course || leadMatch?.programme || "B.Tech";
        const phone = f.phone || f.mobileNo || f.mobile || leadMatch?.mobileNo || leadMatch?.phone || "";
        const priority = (f.priority || leadMatch?.opinion || leadMatch?.temperature || "HOT").toUpperCase();
        return {
          ...f,
          id: leadId,
          enquiryNo: leadId,
          name: resolvedName,
          course,
          phone,
          priority,
          time: f.scheduledTime || f.time || "Scheduled",
          scheduledDate: f.scheduledDate || f.date || todayStr,
          scheduledTime: f.scheduledTime || f.time || "10:00 AM",
          status: String(f.status || "PENDING").toUpperCase(),
        };
      });

      // Next best leads: pending followups or high-priority leads
      let nextCalls = mappedFollowups
        .filter(f => String(f.status || "").toUpperCase() === "PENDING")
        .sort((a, b) => new Date(`${a.scheduledDate}T${a.scheduledTime}`) - new Date(`${b.scheduledDate}T${b.scheduledTime}`))
        .slice(0, 5);

      // If no pending followups, populate nextCalls from hot/warm leads
      if (nextCalls.length === 0 && leads.length > 0) {
        nextCalls = leads
          .filter(l => (l.status || "").toUpperCase() !== "ENROLLED" && (l.status || "").toUpperCase() !== "COMPLETED")
          .slice(0, 5)
          .map(l => ({
            id: l.enquiryNo || l.id,
            enquiryNo: l.enquiryNo || l.id,
            name: l.name || l.studentName || l.student?.name || l.fullName || "Student",
            course: l.course || l.programme || "B.Tech",
            phone: l.mobileNo || l.phone || l.mobile || "",
            priority: ((l.opinion || l.temperature || "HOT").toUpperCase() === "HOT" ? "HOT" : "WARM"),
            time: "Today",
            status: "PENDING"
          }));
      }

      const todaysFocus = {
        highPriority: mappedFollowups.filter(f => 
          String(f.status || "").toUpperCase() === "PENDING" && 
          String(f.priority || "").toUpperCase() === "HIGH" && 
          f.scheduledDate === todayStr
        ).length,
        overdueFollowups: mappedFollowups.filter(f => 
          String(f.status || "").toUpperCase() === "MISSED" || 
          (String(f.status || "").toUpperCase() === "PENDING" && f.scheduledDate < todayStr)
        ).length,
        callsRemaining: 0,
        nearConversion: leads.filter(l => 
          ((l.opinion || l.temperature || "").toUpperCase() === "HOT") && 
          (l.status || "").toUpperCase() !== "ENROLLED" && 
          (l.status || "").toUpperCase() !== "COMPLETED"
        ).length
      };

      const analytics = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return { date: d.toISOString().split("T")[0], calls: 0, interested: 0 };
      });

      const weeklyPerformance = computeWeeklyPerformance(calls, interestedCount, admissionsCount, targets);
      const activities = formatRecentActivity(calls, leads, 10);

      return {
        summary,
        nextCalls,
        todaysFocus,
        pipeline,
        analytics,
        weeklyPerformance,
        activities,
        leads,
        followups: mappedFollowups
      };
    } catch (error) {
      console.error("Dashboard calculation failed:", error);
      return null;
    }
  }
};
