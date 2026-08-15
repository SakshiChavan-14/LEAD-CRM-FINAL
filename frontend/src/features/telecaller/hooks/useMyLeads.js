import { useQuery } from "@tanstack/react-query";
import { telecallerLeadService } from "../services/telecallerLeadService";
import { mapLeadOverview } from "../mappers/telecallerViewModelMapper";

export const useTelecallerLeads = (filters = {}, page = 0, size = 10) => {
  return useQuery({
    queryKey: ["telecaller", "leads", filters, page, size],
    queryFn: async () => {
      const rawData = await telecallerLeadService.getMyLeads({ page, size, ...filters });
      

      const leadsArray =
        rawData?.content ||
        rawData?.leads ||
        (Array.isArray(rawData) ? rawData : []);

      return {
        ...rawData,
        leads: leadsArray.map(mapLeadOverview),
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
