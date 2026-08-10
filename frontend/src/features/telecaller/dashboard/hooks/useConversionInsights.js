import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useTelecallerDashboard } from "../../hooks/useTelecallerDashboard";

export const useConversionInsights = () => {
  const { data: dashboardData } = useTelecallerDashboard();

  return useQuery({
    queryKey: ["conversionInsights"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/leads/telecaller/dashboard/conversion-insights");
        return response.data.data;
      } catch (error) {
        // Fallback: Derive from dashboard metrics
        const leads = dashboardData?.leads || [];
        const followups = dashboardData?.followups || [];

        const assigned = leads.length;

        // Contacted: callCount > 0 or status not NEW/LEAD IN
        const contacted = leads.filter((l) => {
          const status = (l.status || "").toUpperCase();
          const stage = (l.stage || "").toUpperCase();
          const leadStatus = (l.leadStatus || "").toUpperCase();
          const currentStage = (l.currentStage || "").toUpperCase();

          const notContacted = ["NEW", "LEAD IN", "LEAD_IN"];
          return (
            (l.callCount && l.callCount > 0) ||
            (!notContacted.includes(status) && status !== "") ||
            (!notContacted.includes(stage) && stage !== "") ||
            (!notContacted.includes(leadStatus) && leadStatus !== "") ||
            (!notContacted.includes(currentStage) && currentStage !== "")
          );
        }).length;

        // Interested: status/stage is INTERESTED or higher
        const interested = leads.filter((l) => {
          const status = (l.status || "").toUpperCase();
          const stage = (l.stage || "").toUpperCase();
          const leadStatus = (l.leadStatus || "").toUpperCase();
          const currentStage = (l.currentStage || "").toUpperCase();

          const interestedOrHigher = [
            "INTERESTED",
            "APPLICATION",
            "APPLIED",
            "DOCUMENTS",
            "DOCUMENT_VERIFICATION",
            "ENROLLED",
            "ADMISSION",
            "ADMITTED",
          ];
          return (
            interestedOrHigher.includes(status) ||
            interestedOrHigher.includes(stage) ||
            interestedOrHigher.includes(leadStatus) ||
            interestedOrHigher.includes(currentStage)
          );
        }).length;

        // Followups: count of unique leads in followups list or status containing follow
        const followupLeadIds = new Set(followups.map((f) => f.leadId || f.enquiryNo));
        const followupsCount = leads.filter((l) => {
          const status = (l.status || "").toUpperCase();
          const stage = (l.stage || "").toUpperCase();
          const isFollowupStatus = status.includes("FOLLOW") || stage.includes("FOLLOW");
          return followupLeadIds.has(l.enquiryNo) || isFollowupStatus;
        }).length;

        // Converted
        const converted = leads.filter((l) => {
          const status = (l.status || "").toUpperCase();
          const stage = (l.stage || "").toUpperCase();
          const leadStatus = (l.leadStatus || "").toUpperCase();
          const currentStage = (l.currentStage || "").toUpperCase();

          const convertedStatuses = ["ENROLLED", "ADMISSION", "ADMITTED"];
          return (
            convertedStatuses.includes(status) ||
            convertedStatuses.includes(stage) ||
            convertedStatuses.includes(leadStatus) ||
            convertedStatuses.includes(currentStage)
          );
        }).length;

        const conversionRate = assigned > 0 ? parseFloat(((converted / assigned) * 100).toFixed(1)) : 0;

        return {
          assigned,
          contacted: Math.min(assigned, Math.max(contacted, interested)), // Guarantee funnel sequence
          interested: Math.min(contacted, Math.max(interested, followupsCount)),
          followups: Math.min(interested, Math.max(followupsCount, converted)),
          converted,
          conversionRate,
        };
      }
    },
    staleTime: 60 * 1000,
    enabled: !!dashboardData,
  });
};
