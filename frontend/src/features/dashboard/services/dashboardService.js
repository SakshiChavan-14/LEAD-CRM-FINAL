import axiosInstance from "@/lib/axios";
import API_ENDPOINTS from "@/utils/apiEndpoints";

const toNumber = (v) => {
  if (v === undefined || v === null || v === "" || v === "--" || v === "—") return 0;
  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

const toPercent = (v) => {
  if (v === undefined || v === null || v === "" || v === "--" || v === "—") return "0.0%";
  const cleanStr = String(v).replace("%", "");
  const n = Number(cleanStr);
  return `${(isNaN(n) ? 0 : n).toFixed(1)}%`;
};

const normalizeStats = (raw) => {
  const overall = raw?.overall || raw || {};
  return [
    {
      id: 1,
      title: "Total Leads",
      value: overall.total || overall.totalLeads || overall.total_leads || 0,
      subtitle: "All time",
      type: "success",
    },
    {
      id: 2,
      title: "Active Leads",
      value: overall.alloted || overall.allotted || overall.active || overall.activeLeads || 0,
      subtitle: "In Pipeline",
      type: "default",
    },
    {
      id: 3,
      title: "New Today",
      value: overall.recent || overall.new || overall.newLeads || overall.recentLeads || 0,
      subtitle: "Recent Leads",
      type: "default",
    },
    {
      id: 4,
      title: "Pending Assign",
      value: overall.notAlloted || overall.notAllotted || overall.pendingAssign || overall.unassigned || overall.not_allotted || 0,
      subtitle: "Requires Action",
      type: "warning",
    },
    {
      id: 5,
      title: "Conversion Rate",
      value: toPercent(overall.conversionRate || overall.conversion_rate || overall.conversion),
      subtitle: "Overall success rate",
      type: "default",
    },
    {
      id: 6,
      title: "Telecallers",
      value: toNumber(overall.activeTelecallers || overall.telecallers || overall.active_telecallers || overall.activeTelecallersCount),
      subtitle: "Active callers online",
      type: "default",
    },
    {
      id: 7,
      title: "Admissions",
      value: toNumber(overall.totalAdmissions || overall.admissions || overall.admissionsCount || overall.admissions_count),
      subtitle: "Successful admissions",
      type: "default",
    },
  ];
};

const normalizeTemperature = (raw) => {
  const overall = raw?.overall || raw || {};
  return {
    hot: overall.hot || overall.hotLeads || overall.hot_leads || 0,
    cold: overall.cold || overall.coldLeads || overall.cold_leads || 0,
  };
};

const normalizeSourceAnalytics = (raw) => {
  const sources = raw.sourceStats || [];
  return sources.map((item) => ({
    label: item.groupName || "Unknown",
    value: item.total || 0,
  }));
};

const normalizeUpcomingFollowups = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw.map((lead) => ({
    id: lead.enquiryNo || lead.id,
    student: lead.name || "Unknown Student",
    telecaller: lead.callerName || lead.caller_name || lead.telecallerName || lead.telecaller || "Unassigned",
    course: lead.course || lead.programme || "N/A",
    time: lead.followupDate ? new Date(lead.followupDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Today",
    priority: lead.opinion === "Interested" ? "High" : lead.opinion === "Warm" ? "Medium" : "Low",
    status: "Today",
  }));
};

const normalizeOverdueFollowups = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw.map((lead) => ({
    id: lead.enquiryNo || lead.id,
    student: lead.name || "Unknown Student",
    telecaller: lead.callerName || lead.caller_name || lead.telecallerName || lead.telecaller || "Unassigned",
    course: lead.course || lead.programme || "N/A",
    time: lead.followupDate ? new Date(lead.followupDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Overdue",
    priority: lead.opinion === "Interested" ? "High" : lead.opinion === "Warm" ? "Medium" : "Low",
    status: "Overdue",
  }));
};

const normalizeActivityTimeline = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw.map((activity) => ({
    id: activity.id || Math.random().toString(),
    title: activity.title || "Activity",
    description: activity.description || "",
    time: activity.time ? new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
    color: activity.color || "bg-blue-500",
  }));
};

const extractData = (res) => (res.status === "fulfilled" ? res.value.data.data || res.value.data : null);

const normalizePipeline = (raw) => {
  const pipelineData = raw.pipeline || raw.statusBreakdown;
  if (!pipelineData) return [];
  
  if (Array.isArray(pipelineData)) {
    return pipelineData.map(item => ({
      stage: item.stage || item.status || item.rawStatus || item.name,
      count: item.count || item.value || item.total || 0
    }));
  }
  
  if (typeof pipelineData === 'object') {
    return Object.entries(pipelineData).map(([key, value]) => ({
      stage: key,
      count: Number(value) || 0
    }));
  }
  
  return [];
};

const dashboardService = {
  getStats: async (params) => {
    const [statsRes, upcomingRes, overdueRes, activityRes] = await Promise.allSettled([
      axiosInstance.get(API_ENDPOINTS.DASHBOARD.STATS, { params }),
      axiosInstance.get(API_ENDPOINTS.LEADS.UPCOMING, { params }),
      axiosInstance.get(API_ENDPOINTS.LEADS.OVERDUE, { params }),
      axiosInstance.get(API_ENDPOINTS.DASHBOARD.ACTIVITY, { params }),
    ]);

    const statsData = extractData(statsRes);
    if (!statsData) {
      throw new Error("Dashboard stats unavailable");
    }

    const upcomingData = extractData(upcomingRes);
    const overdueData = extractData(overdueRes);
    const activityData = extractData(activityRes);

    return {
      stats: normalizeStats(statsData),
      temperature: normalizeTemperature(statsData),
      charts: {
        sourceAnalytics: normalizeSourceAnalytics(statsData),
        pipeline: normalizePipeline(statsData),
        temperatureBreakdown: [
          { label: "Hot", value: statsData.overall?.hot || statsData.hot || 0 },
          { label: "Cold", value: statsData.overall?.cold || statsData.cold || 0 }
        ],
        monthlyTrend: statsData.monthlyTrend || statsData.trend || [],
      },
      tables: {
        recentLeads: {
          data: [],
          error: null,
        },
        followups: {
          upcoming: {
            data: upcomingData ? normalizeUpcomingFollowups(upcomingData) : null,
            error: upcomingRes.status === "rejected" ? upcomingRes.reason : null,
          },
          overdue: {
            data: overdueData ? normalizeOverdueFollowups(overdueData) : null,
            error: overdueRes.status === "rejected" ? overdueRes.reason : null,
          },
        },
      },
      timeline: {
        data: activityData ? normalizeActivityTimeline(activityData) : null,
        error: activityRes.status === "rejected" ? activityRes.reason : null,
      },
    };
  },
};

export default dashboardService;
