import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import API_ENDPOINTS from "@/utils/apiEndpoints";

const STALE_TIME = 60000;
const GC_TIME = 300000;

export const useMonthlyTrend = (months = 6) => {
  return useQuery({
    queryKey: ["dashboard", "monthly-trend", months],
    queryFn: async () => {
      const { data } = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.MONTHLY_TREND(months));
      return data?.data || data || [];
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const useCourseDistribution = () => {
  return useQuery({
    queryKey: ["reports", "course-distribution"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(API_ENDPOINTS.REPORTS.COURSE_DISTRIBUTION);
      return data?.data || data || [];
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const useDatewiseSummary = () => {
  return useQuery({
    queryKey: ["reports", "datewise-summary"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(API_ENDPOINTS.REPORTS.DATEWISE_SUMMARY);
      return data?.data || data || [];
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
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

export const useTelecallerFollowups = (empId, status = "ALL", page = 0, size = 20) => {
  return useQuery({
    queryKey: ["telecaller-followups", empId, status, page],
    queryFn: async () => {
      const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN_TELECALLER.FOLLOWUPS(empId, status, page, size));
      return data?.data || { items: [], totalItems: 0, currentPage: 0, totalPages: 0 };
    },
    enabled: !!empId,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};
