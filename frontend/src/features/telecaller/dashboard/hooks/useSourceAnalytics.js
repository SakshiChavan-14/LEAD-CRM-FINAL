import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useTelecallerDashboard } from "../../hooks/useTelecallerDashboard";

export const useSourceAnalytics = () => {
  const { data: dashboardData } = useTelecallerDashboard();

  return useQuery({
    queryKey: ["sourceAnalytics"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/leads/telecaller/dashboard/source-analytics");
        return response.data.data;
      } catch (error) {
        // Fallback: Aggregate from dashboard leads
        const leads = dashboardData?.leads || [];
        const sourceMap = {};

        leads.forEach((lead) => {
          const source = lead.source || "Unknown";
          if (!sourceMap[source]) {
            sourceMap[source] = { source, total: 0, converted: 0 };
          }
          sourceMap[source].total += 1;

          const status = (lead.status || "").toUpperCase();
          const stage = (lead.stage || "").toUpperCase();
          const leadStatus = (lead.leadStatus || "").toUpperCase();
          const currentStage = (lead.currentStage || "").toUpperCase();
          const convertedStatuses = ["ENROLLED", "ADMISSION", "ADMITTED"];

          const isConverted =
            convertedStatuses.includes(status) ||
            convertedStatuses.includes(stage) ||
            convertedStatuses.includes(leadStatus) ||
            convertedStatuses.includes(currentStage);

          if (isConverted) {
            sourceMap[source].converted += 1;
          }
        });

        return Object.values(sourceMap)
          .sort((a, b) => b.total - a.total)
          .slice(0, 5); // Top 5 sources
      }
    },
    staleTime: 60 * 1000,
    enabled: !!dashboardData,
  });
};
