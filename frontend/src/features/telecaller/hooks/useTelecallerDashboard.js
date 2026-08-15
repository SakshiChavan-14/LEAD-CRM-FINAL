import { useQuery } from "@tanstack/react-query";
import { telecallerDashboardService } from "../services/telecallerDashboardService";
import { mapDashboard } from "../mappers/telecallerViewModelMapper";

export const useTelecallerDashboard = () => {
  return useQuery({
    queryKey: ["telecallerDashboard"],
    queryFn: async () => {
      const rawData = await telecallerDashboardService.getDashboardV2();
      const mapped = mapDashboard(rawData);
      return {
        ...mapped,
        performance: rawData?.performance || { daily: [], monthly: [], weekly: [] },
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
