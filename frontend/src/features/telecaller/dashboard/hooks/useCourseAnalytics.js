import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useTelecallerDashboard } from "../../hooks/useTelecallerDashboard";

export const useCourseAnalytics = () => {
  const { data: dashboardData } = useTelecallerDashboard();

  return useQuery({
    queryKey: ["courseAnalytics"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/leads/telecaller/dashboard/course-analytics");
        return response.data.data;
      } catch (error) {
        // Fallback: Aggregate from dashboard leads by course
        const leads = dashboardData?.leads || [];
        const courseMap = {};

        leads.forEach((lead) => {
          const course = lead.course || "Unknown";
          if (!courseMap[course]) {
            courseMap[course] = { course, total: 0, converted: 0 };
          }
          courseMap[course].total += 1;

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
            courseMap[course].converted += 1;
          }
        });

        return Object.values(courseMap)
          .sort((a, b) => b.total - a.total);
      }
    },
    staleTime: 60 * 1000,
    enabled: !!dashboardData,
  });
};
