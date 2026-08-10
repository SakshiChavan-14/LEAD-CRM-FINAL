import { useQuery } from "@tanstack/react-query";
import leadService from "../services/leadService";

/**
 * TEMPORARY HOOK — Sprint 22.2
 * 
 * Requests maximum page size supported by backend configuration (size=5000)
 * strictly when the assignment modal is open.
 * 
 * DELETE THIS HOOK once GET /api/leads/manager/users returns assignedLeadCount.
 */
export const useAllLeadsForWorkload = (isOpen) => {
  return useQuery({
    queryKey: ["allLeadsForWorkload"],
    queryFn: async () => {
      const response = await leadService.getOverviewLeads({ page: 0, size: 5000 });
      return response?.leads || response?.content || response?.data || (Array.isArray(response) ? response : []);
    },
    enabled: !!isOpen,
    staleTime: 60 * 1000,
  });
};
