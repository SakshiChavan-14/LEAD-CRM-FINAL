import axiosInstance from "@/lib/axios";
import API_ENDPOINTS from "@/utils/apiEndpoints";

export const telecallerTargetsService = {
  getTargets: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.TARGETS.LIST);
    return response.data?.data || response.data || [];
  },

  updateTargets: async (payload) => {
    const response = await axiosInstance.put(API_ENDPOINTS.TARGETS.UPDATE, payload);
    return response.data?.data || response.data;
  }
};
