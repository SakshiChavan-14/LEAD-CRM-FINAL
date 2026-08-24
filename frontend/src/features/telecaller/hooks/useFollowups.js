import { useQuery } from "@tanstack/react-query";
import { telecallerFollowupService } from "../services/telecallerFollowupService";
import axiosInstance from "@/lib/axios";
import API_ENDPOINTS from "@/utils/apiEndpoints";

export const useFollowups = (tab = "today", filters = {}) => {
  return useQuery({
    queryKey: ["followups", tab, filters],
    queryFn: async () => {
      try {
        // Try telecaller endpoint first
        return await telecallerFollowupService.getFollowups({ tab, ...filters });
      } catch (e) {
        console.log("[useFollowups] Telecaller endpoint failed or unauthorized, trying admin fallback");
        try {
          // 1. Fetch telecallers list
          const usersRes = await axiosInstance.get(API_ENDPOINTS.USERS.LIST, { params: { size: 1000 } });
          const usersData = usersRes.data?.data ?? usersRes.data ?? {};
          const users = usersData.users || usersData.content || (Array.isArray(usersData) ? usersData : []);
          const telecallers = users.filter(u => {
            const role = (u.userGroup || u.role || "").toUpperCase();
            return role.includes("TELE");
          });

          // 2. Fetch follow-ups for each telecaller
          const promises = telecallers.map(tc =>
            axiosInstance.get(`/api/leads/telecaller/${tc.empId}/followups`, {
              params: { status: "ALL", size: 1000 }
            }).catch(() => null)
          );
          const results = await Promise.all(promises);
          const allFollowups = [];
          results.forEach(res => {
            if (!res) return;
            const content = res.data?.data?.items || res.data?.data?.content || res.data?.data || [];
            allFollowups.push(...content);
          });
          
          // Map followups to match the UI shape expected by mapFollowup
          const mapped = allFollowups.map(f => ({
            id: f.id || f.slNo,
            leadId: f.leadId || f.enquiryNo || f.enquiry_no,
            enquiryNo: f.enquiryNo || f.enquiry_no || f.leadId,
            name: f.studentName || f.name || "Unknown",
            phone: f.mobileNo || f.phone || "N/A",
            course: f.course || "N/A",
            priority: f.priority || "Medium",
            scheduledDate: f.scheduledDate || f.date,
            scheduledTime: f.scheduledTime || f.time,
            status: f.status || "PENDING",
            remarks: f.remarks || f.notes || "",
            createdAt: f.createdAt
          }));
          return mapped;
        } catch (err) {
          console.error("[useFollowups] Admin fallback failed:", err);
          return [];
        }
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};
