import axiosInstance from "@/lib/axios";
import API_ENDPOINTS from "@/utils/apiEndpoints";

const leadImportApi = {
  uploadCsv: async (file, autoAssign = false, onUploadProgress) => {
    const formData = new FormData();
    formData.append("csv_file", file);
    formData.append("autoAssign", autoAssign ? "true" : "false");

    const response = await axiosInstance.post(API_ENDPOINTS.LEADS.IMPORT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
    return response.data;
  },

  getImportStatus: async (jobId) => {
    const response = await axiosInstance.get(API_ENDPOINTS.LEADS.IMPORT_STATUS(jobId));
    return response.data;
  },
};

export default leadImportApi;
