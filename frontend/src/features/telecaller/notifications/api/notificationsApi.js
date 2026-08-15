import axiosInstance from "@/lib/axios";
import API_ENDPOINTS from "@/utils/apiEndpoints";

const notificationsApi = {
  getNotifications: async (page = 0, size = 10) => {
    const response = await axiosInstance.get(API_ENDPOINTS.TELECALLER.NOTIFICATIONS, {
      params: { page, size }
    });
    const resData = response.data;
    if (resData?.success && resData?.data) {
      const content = resData.data.content || [];
      const mappedContent = content.map(raw => ({
        id: raw.id,
        title: raw.title,
        message: raw.message,
        type: raw.type,
        referenceId: raw.referenceId,
        read: raw.isRead,
        createdAt: raw.createdAt
      }));
      return {
        content: mappedContent,
        pageable: resData.data.pageable || { pageNumber: page, pageSize: size },
        totalElements: resData.data.totalElements || mappedContent.length,
        totalPages: resData.data.totalPages || 1
      };
    }
    return {
      content: [],
      pageable: { pageNumber: page, pageSize: size },
      totalElements: 0,
      totalPages: 0
    };
  },

  getUnreadCount: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.TELECALLER.UNREAD_NOTIFICATIONS_COUNT);
    const resData = response.data;
    if (resData?.success && typeof resData?.data === "number") {
      return resData.data;
    }
    return 0;
  },

  markAsRead: async (id) => {
    const response = await axiosInstance.patch(API_ENDPOINTS.TELECALLER.NOTIFICATION_READ(id));
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axiosInstance.patch(API_ENDPOINTS.TELECALLER.NOTIFICATIONS_READ_ALL);
    return response.data;
  }
};

export default notificationsApi;
