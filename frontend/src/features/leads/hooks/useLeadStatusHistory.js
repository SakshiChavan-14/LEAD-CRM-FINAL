import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import axiosInstance from "@/lib/axios";
import API_ENDPOINTS from "@/utils/apiEndpoints";

export const useLeadStatusHistory = (enquiryNo) => {
  return useQuery({
    queryKey: ["lead-status-history", enquiryNo],
    queryFn: async () => {
      const endpoint = API_ENDPOINTS.LEADS.STATUS_HISTORY(enquiryNo);
      
      try {
        const { data } = await axiosInstance.get(endpoint);
        return data?.data || data || [];
      } catch (error) {
        // Fallback for missing endpoint during transition
        if (error.response?.status === 404) return [];
        throw error;
      }
    },
    enabled: !!enquiryNo,
    staleTime: 0,
    gcTime: 300000,
  });
};
