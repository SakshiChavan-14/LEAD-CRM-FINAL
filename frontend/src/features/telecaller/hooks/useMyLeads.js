import { useQuery } from "@tanstack/react-query";
import { telecallerLeadService } from "../services/telecallerLeadService";
import { mapLeadOverview } from "../mappers/telecallerViewModelMapper";

export const useTelecallerLeads = (filters = {}, page = 0, size = 10) => {
  const activeFilters = Object.fromEntries(
    Object.entries(filters || {}).filter(
      ([_, v]) => v !== "" && v !== null && v !== undefined
    )
  );

  return useQuery({
    queryKey: ["telecaller", "leads", activeFilters, page, size],
    queryFn: async () => {
      const rawData = await telecallerLeadService.getMyLeads({ page, size, ...activeFilters });

      const leadsArray =
        rawData?.content ||
        rawData?.leads ||
        (Array.isArray(rawData) ? rawData : []);

      return {
        ...rawData,
        leads: leadsArray.map(mapLeadOverview),
        totalItems: rawData?.totalItems ?? rawData?.totalElements ?? rawData?.total ?? leadsArray.length,
        totalPages: (rawData?.totalPages ?? rawData?.page?.totalPages ?? Math.ceil((rawData?.totalItems ?? leadsArray.length) / size)) || 1,
        currentPage: rawData?.currentPage ?? rawData?.page?.number ?? page,
      };
    },
    staleTime: 5 * 60 * 1000,
    keepPreviousData: false,
  });
};
