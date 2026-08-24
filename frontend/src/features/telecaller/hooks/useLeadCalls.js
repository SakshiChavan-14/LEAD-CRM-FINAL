import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import API_ENDPOINTS from "@/utils/apiEndpoints";

export const useLeadCalls = (enquiryNo = null) => {
  return useQuery({
    queryKey: ["telecaller", "calls", enquiryNo],
    queryFn: async () => {
      let allCalls = [];

      // ── Strategy 1: Telecaller's own calls endpoint ──────────────────────
      // Works when the logged-in user IS the telecaller
      try {
        const { data } = await axiosInstance.get(
          `${API_ENDPOINTS.TELECALLER.CALLS}?size=1000`
        );
        const raw = data?.data || data || {};
        const content = raw?.content || (Array.isArray(raw) ? raw : []);
        if (content.length > 0) {
          allCalls = content;
        }
      } catch (e) {
        console.log("[useLeadCalls] Telecaller calls endpoint failed:", e?.response?.status);
      }

      // ── Strategy 2: Admin individual calls endpoint ──────────────────────
      // Works when admin is viewing a lead — aggregate across all telecallers
      if (allCalls.length === 0) {
        try {
          // Get telecallers list from the reports users endpoint
          const usersRes = await axiosInstance.get(API_ENDPOINTS.REPORTS.USERS, { params: { size: 1000 } });
          const usersData = usersRes.data?.data ?? usersRes.data ?? {};
          const telecallers = usersData.content || usersData.users || (Array.isArray(usersData) ? usersData : []);

          if (telecallers.length > 0) {
            const logsPromises = telecallers.map(tc => {
              const empId = tc.userId || tc.empId || tc.id;
              if (!empId) return null;
              return axiosInstance.get(API_ENDPOINTS.REPORTS.INDIVIDUAL, {
                params: { empId, size: 1000 }
              }).catch(() => null);
            }).filter(Boolean);
            
            const logsRes = await Promise.all(logsPromises);
            logsRes.forEach(res => {
              if (!res) return;
              const d = res.data?.data || res.data || {};
              const c = d?.content || (Array.isArray(d) ? d : []);
              allCalls.push(...c);
            });
          }
        } catch (e) {
          console.log("[useLeadCalls] Admin individual calls endpoint failed:", e?.response?.status);
        }
      }

      // ── Strategy 3: Datewise summary as last resort ──────────────────────
      if (allCalls.length === 0) {
        try {
          const { data } = await axiosInstance.get(API_ENDPOINTS.REPORTS.DATEWISE_SUMMARY);
          const raw = data?.data || data || {};
          const content = raw?.content || (Array.isArray(raw) ? raw : []);
          if (content.length > 0) allCalls = content;
        } catch (e) {
          console.log("[useLeadCalls] Datewise summary endpoint failed:", e?.response?.status);
        }
      }

      console.log("[useLeadCalls] Total calls fetched:", allCalls.length, "| Filtering for enquiryNo:", enquiryNo);
      
      if (enquiryNo) {
        const cleanEnquiryNo = String(enquiryNo).replace(/[^\d]/g, "");
        const filtered = allCalls.filter(c => {
          const callEnquiry = String(c.enquiryNo || c.leadId || "").replace(/[^\d]/g, "");
          return callEnquiry === cleanEnquiryNo;
        });
        console.log("[useLeadCalls] Filtered calls for enquiryNo", cleanEnquiryNo, ":", filtered.length);
        if (filtered.length > 0) {
          console.log("[useLeadCalls] Sample call keys:", Object.keys(filtered[0]));
        }
        return filtered;
      }
      return allCalls;
    },
    staleTime: 60000,
  });
};
