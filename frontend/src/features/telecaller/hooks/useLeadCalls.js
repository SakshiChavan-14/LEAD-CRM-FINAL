import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import API_ENDPOINTS from "@/utils/apiEndpoints";

export const useLeadCalls = (enquiryNo = null) => {
  return useQuery({
    queryKey: ["telecaller", "calls", enquiryNo],
    queryFn: async () => {
      const { data } = await axiosInstance.get(API_ENDPOINTS.TELECALLER.CALLS);
      const rawData = data?.data || data || [];
      const calls = Array.isArray(rawData)
        ? rawData
        : rawData.content && Array.isArray(rawData.content)
        ? rawData.content
        : [];

      if (enquiryNo) {
        return calls.filter(c => String(c.enquiryNo) === String(enquiryNo));
      }
      return calls;
    },
    staleTime: 60000,
  });
};
