const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/leads/auth/login",
    LOGOUT: "/api/leads/auth/logout",
    REFRESH: "/api/leads/auth/refresh",
    ME: "/api/leads/auth/me",
    PROFILE: "/api/leads/auth/profile",
    CHANGE_PASSWORD: "/api/leads/auth/change-password",
  },

  USERS: {
    LIST: "/api/leads/manager/users",
    CREATE: "/api/leads/manager/users",
    UPDATE: "/api/leads/manager/users",

    TOGGLE_STATUS: (slNo) =>
      `/api/leads/manager/users/${slNo}/status`,
  },

  LEADS: {
    LIST: "/api/leads/overview",
    COUNTS: "/api/leads/manager/leads/counts",

    CREATE: "/api/leads/manager/leads",
    UPDATE: "/api/leads/manager/leads",
    DELETE: (enquiryNo) =>
      `/api/leads/manager/leads/${enquiryNo}`,

    DETAIL: (enquiryNo) => `/api/leads/${enquiryNo}`,
    TIMELINE: (enquiryNo) => `/api/leads/${enquiryNo}/timeline`,
    NOTES: (enquiryNo) => `/api/leads/${enquiryNo}/notes`,
    STATUS: (enquiryNo) => `/api/leads/${enquiryNo}/status`,
    STATUS_HISTORY: (enquiryNo) => `/api/leads/telecaller/leads/${enquiryNo}/status-history`,

    ASSIGN: "/api/leads/manager/leads/assign",

    TRANSFER: "/api/leads/manager/leads/transfer",

    IMPORT: "/api/leads/manager/leads/import",

    IMPORT_STATUS: (jobId) =>
      `/api/leads/manager/leads/import/status/${jobId}`,

    EXPORT: "/api/leads/manager/export",

    FILTER_OPTIONS:
      "/api/leads/overview/filter-options",

    UPCOMING:
      "/api/leads/overview/followups/upcoming",

    OVERDUE:
      "/api/leads/overview/followups/overdue",

    GEO: {
      STATES: "/api/leads/geo/states",
      DISTRICTS: (state) => `/api/leads/geo/districts?state=${encodeURIComponent(state)}`,
      TALUKS: (district) => `/api/leads/geo/taluks?district=${encodeURIComponent(district)}`,
    },
  },

  DASHBOARD: {
    STATS: "/api/leads/dashboard/stats",
    ACTIVITY: "/api/leads/dashboard/activity",
    MONTHLY_TREND: (months = 6) => `/api/leads/dashboard/stats/monthly-trend?months=${months}`,
  },

  REPORTS: {
    USERS: "/api/leads/calls/users",

    DATE_DETAILS:
      "/api/leads/calls/date-details",

    INDIVIDUAL:
      "/api/leads/calls/individual",

    SOURCE_LEADS:
      "/api/leads/calls/source-leads",

    DATEWISE_SUMMARY:
      "/api/leads/calls/datewise-summary",

    COURSE_DISTRIBUTION: "/api/leads/reports/course-distribution",

    EXPORT: "/api/leads/reports/export",

    TELECALLER_EXPORT: (id) =>
      `/api/leads/reports/telecaller/${id}/export`,
  },

  ADMIN_TELECALLER: {
    TIMELINE: (empId, page = 0, size = 20) =>
      `/api/leads/telecaller/${empId}/timeline?page=${page}&size=${size}`,
    FOLLOWUPS: (empId, status = "ALL", page = 0, size = 20) =>
      `/api/leads/telecaller/${empId}/followups?status=${status}&page=${page}&size=${size}`,
  },

  TELECALLER: {
    DASHBOARD: "/api/leads/telecaller/dashboard",
    DASHBOARD_V2: "/api/leads/telecaller/dashboard/v2",
    INTERACTIONS: "/api/leads/telecaller/interactions",
    LEADS: "/api/leads/telecaller/leads",
    LEAD_DETAILS: (enquiryNo) => `/api/leads/telecaller/leads/${enquiryNo}`,
    LEAD_TIMELINE: (enquiryNo) => `/api/leads/telecaller/leads/${enquiryNo}/timeline`,
    LEAD_NOTES: (enquiryNo) => `/api/leads/telecaller/leads/${enquiryNo}/notes`,
    LEAD_STATUS: (enquiryNo) => `/api/leads/telecaller/leads/${enquiryNo}/status`,
    LEAD_STATUS_HISTORY: (enquiryNo) => `/api/leads/telecaller/leads/${enquiryNo}/status-history`,
    LEAD_FILTER_OPTIONS: "/api/leads/telecaller/leads/filter-options",
    CALLS: "/api/leads/telecaller/calls",
    CALL_DETAILS: (callId) => `/api/leads/telecaller/calls/${callId}`,
    CALL_RECORDING_AUDIO: (callId) => `/api/leads/telecaller/calls/${callId}/recording`,
    FOLLOWUPS: "/api/leads/telecaller/followups",
    FOLLOWUP_DETAILS: (id) => `/api/leads/telecaller/followups/${id}`,
    NOTIFICATIONS: "/api/leads/telecaller/notifications",
    UNREAD_NOTIFICATIONS_COUNT: "/api/leads/telecaller/notifications/unread-count",
    NOTIFICATION_READ: (id) => `/api/leads/telecaller/notifications/${id}/read`,
    NOTIFICATIONS_READ_ALL: "/api/leads/telecaller/notifications/read-all",
    AVATAR: "/api/leads/telecaller/profile/avatar",
    VOICE: {
      TOKEN: "/api/leads/telecaller/voice/token",
      RECORDING: (interactionId) => `/api/leads/telecaller/voice/recordings/${interactionId}`,
    }
  },
  TARGETS: {
    LIST: "/api/leads/manager/targets",
    UPDATE: "/api/leads/manager/targets",
  }
};
 

export default API_ENDPOINTS;