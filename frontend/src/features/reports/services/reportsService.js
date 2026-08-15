import axiosInstance from "@/lib/axios";
import API_ENDPOINTS from "@/utils/apiEndpoints";

const reportsService = {
  exportTeamReport: async (format = "csv", range = "this-month", team = "all") => {
    const response = await axiosInstance.get(API_ENDPOINTS.REPORTS.EXPORT, {
      params: { format, range, team },
      responseType: "blob",
    });
    return response.data;
  },

  exportTelecallerReport: async (id, format = "pdf", range = "this-month") => {
    const response = await axiosInstance.get(API_ENDPOINTS.REPORTS.TELECALLER_EXPORT(id), {
      params: { format, range },
      responseType: "blob",
    });
    return response.data;
  },
};

export default reportsService;
