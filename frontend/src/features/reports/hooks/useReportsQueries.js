import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import axiosInstance from "@/lib/axios";
import API_ENDPOINTS from "@/utils/apiEndpoints";

const STALE_TIME = 60000;
const GC_TIME = 300000;

export const useDashboardRawData = () => {
  return useQuery({
    queryKey: ["dashboard", "raw-data"],
    queryFn: async () => {
      // 1. Fetch leads, users, and callers concurrently
      const [leadsRes, usersRes, callersRes] = await Promise.all([
        axiosInstance.get(API_ENDPOINTS.LEADS.LIST, { params: { size: 10000 } }).catch(() => ({ data: { data: [] } })),
        axiosInstance.get(API_ENDPOINTS.USERS.LIST, { params: { size: 1000 } }).catch(() => ({ data: { data: [] } })),
        axiosInstance.get(API_ENDPOINTS.REPORTS.USERS, { params: { size: 100 } }).catch(() => ({ data: { data: [] } })),
      ]);

      const leadsData = leadsRes.data?.data ?? leadsRes.data ?? {};
      const leads = leadsData.leads || leadsData.content || (Array.isArray(leadsData) ? leadsData : []);

      const usersData = usersRes.data?.data ?? usersRes.data ?? {};
      const users = usersData.users || usersData.content || (Array.isArray(usersData) ? usersData : []);

      const callersData = callersRes.data?.data ?? callersRes.data ?? {};
      const callers = callersData.content || callersData.users || (Array.isArray(callersData) ? callersData : []);

      // 2. Resolve telecallers (from callers endpoint or user list)
      const telecallers = callers.length > 0 
        ? callers 
        : users.filter(u => {
            const role = (u.userGroup || u.role || "").toUpperCase();
            return role.includes("TELE") || u.empId;
          });

      // 3. Fetch call logs for each telecaller
      const logsPromises = telecallers.map(tc => {
        const empId = tc.userId || tc.empId || tc.id;
        if (!empId) return Promise.resolve(null);
        return axiosInstance.get(`/api/leads/calls/individual`, {
          params: { empId, size: 1000 }
        }).catch(() => null);
      });

      const logsRes = await Promise.all(logsPromises);
      const allCalls = [];
      logsRes.forEach(res => {
        if (!res) return;
        const data = res.data?.data || res.data || {};
        const content = data.content || (Array.isArray(data) ? data : []);
        allCalls.push(...content);
      });

      return { leads, users, telecallers, allCalls };
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const useMonthlyTrend = (months = 6) => {
  const query = useDashboardRawData();
  
  const data = useMemo(() => {
    if (!query.data) return [];
    const { leads } = query.data;
    
    const monthsNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const trendData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthLabel = monthsNames[d.getMonth()] + " " + String(d.getFullYear()).slice(-2);
      trendData.push({
        month: monthLabel,
        admissions: 0,
        target: 15,
        monthVal: d.getMonth(),
        yearVal: d.getFullYear()
      });
    }

    leads.forEach(l => {
      const statusUpper = (l.status || "").toUpperCase();
      const isAdmission = ["ENROLLED", "COMPLETED", "ADMISSION"].includes(statusUpper);
      if (!isAdmission) return;
      
      const createdDate = new Date(l.createdAt || l.created_at || l.date || Date.now());
      const leadMonth = createdDate.getMonth();
      const leadYear = createdDate.getFullYear();
      
      const monthBucket = trendData.find(b => b.monthVal === leadMonth && b.yearVal === leadYear);
      if (monthBucket) {
        monthBucket.admissions++;
      }
    });

    return trendData;
  }, [query.data]);

  return { ...query, data };
};

export const useCourseDistribution = () => {
  const query = useDashboardRawData();
  
  const data = useMemo(() => {
    if (!query.data) return [];
    const { leads } = query.data;
    
    const courseMap = {};
    leads.forEach(l => {
      const courseName = l.course || "N/A";
      const progName = l.programme || "N/A";
      const isAdmission = ["ENROLLED", "COMPLETED", "ADMISSION"].includes((l.status || "").toUpperCase());
      
      if (!courseMap[courseName]) {
        courseMap[courseName] = {
          course: courseName,
          programme: progName,
          leadCount: 0,
          admissions: 0
        };
      }
      
      courseMap[courseName].leadCount++;
      if (isAdmission) {
        courseMap[courseName].admissions++;
      }
    });
    
    return Object.values(courseMap);
  }, [query.data]);

  return { ...query, data };
};

export const useDatewiseSummary = () => {
  const query = useDashboardRawData();
  
  const data = useMemo(() => {
    if (!query.data) return [];
    const { allCalls } = query.data;
    
    const callsByDate = {};
    allCalls.forEach(c => {
      const dateStr = (c.callDateTime || c.createdAt || c.date || "").split("T")[0];
      if (!dateStr) return;
      if (!callsByDate[dateStr]) {
        callsByDate[dateStr] = { total: 0, connected: 0, missed: 0 };
      }
      callsByDate[dateStr].total++;
      
      const statusUpper = (c.callOutcome || c.outcome || c.interactionStatus || c.status || "").toUpperCase();
      const isConnected = statusUpper === "CONNECTED" || statusUpper === "ANSWERED" || statusUpper === "COMPLETED";
      if (isConnected) {
        callsByDate[dateStr].connected++;
      } else {
        callsByDate[dateStr].missed++;
      }
    });

    return Object.entries(callsByDate)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([date, stats]) => ({
        date,
        totalCalls: stats.total,
        connectedCalls: stats.connected,
        missedCalls: stats.missed
      }))
      .slice(-7); // Last 7 days
  }, [query.data]);

  return { ...query, data };
};

export const useTelecallerTimeline = (empId, page = 0, size = 20) => {
  return useQuery({
    queryKey: ["telecaller-timeline", empId, page],
    queryFn: async () => {
      const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN_TELECALLER.TIMELINE(empId, page, size));
      return data?.data || { items: [], totalItems: 0, currentPage: 0, totalPages: 0 };
    },
    enabled: !!empId,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const useTelecallerFollowups = (empId, status = "ALL", page = 0, size = 50) => {
  return useQuery({
    queryKey: ["telecaller-followups", empId, status, page],
    queryFn: async () => {
      // 1. Try admin telecaller followups endpoint
      try {
        const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN_TELECALLER.FOLLOWUPS(empId, status, page, size));
        const res = data?.data ?? data;
        const items = res?.items || res?.content || (Array.isArray(res) ? res : []);
        if (items.length > 0) return { items, totalItems: items.length };
      } catch (e) {
        console.warn("ADMIN_TELECALLER.FOLLOWUPS failed:", e?.response?.status);
      }

      // 2. Try telecaller followups endpoint
      try {
        const { data } = await axiosInstance.get(API_ENDPOINTS.TELECALLER.FOLLOWUPS, { params: { empId, size: 50 } });
        const res = data?.data ?? data;
        const items = res?.items || res?.content || (Array.isArray(res) ? res : []);
        if (items.length > 0) return { items, totalItems: items.length };
      } catch (e) {
        console.warn("TELECALLER.FOLLOWUPS failed:", e?.response?.status);
      }

      // 3. Try overview upcoming followups
      try {
        const { data } = await axiosInstance.get(API_ENDPOINTS.LEADS.UPCOMING, { params: { empId, size: 50 } });
        const res = data?.data ?? data;
        const items = res?.items || res?.content || (Array.isArray(res) ? res : []);
        if (items.length > 0) return { items, totalItems: items.length };
      } catch (e) {
        console.warn("LEADS.UPCOMING failed:", e?.response?.status);
      }

      return { items: [], totalItems: 0, currentPage: 0, totalPages: 0 };
    },
    enabled: !!empId,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};
