import { useQuery } from "@tanstack/react-query";
import leadService from "../services/leadService";
import { LEAD_KEYS } from "../constants/queryKeys";

export function useLeadCounts() {
  return useQuery({
    queryKey: LEAD_KEYS.counts(),
    queryFn: async () => {
      // 1. Fetch base counts from backend stats/counts API
      let baseCounts = {};
      try {
        const data = await leadService.getLeadCounts();
        console.log("📡 [useLeadCounts] Raw leadCounts from API:", data);
        baseCounts = mapLeadCounts(data);
        console.log("📡 [useLeadCounts] Mapped baseCounts:", baseCounts);
      } catch (e) {
        console.error("📡 [useLeadCounts] Error fetching base counts:", e);
      }

      // 2. Fetch live exact DB counts for all lead bucket types from /api/leads/overview
      const bucketKeys = ["all", "new", "hot", "cold", "alloted", "not-alloted", "not-consulted", "opinion-reassign"];
      const liveCounts = { ...baseCounts };

      const fetches = bucketKeys.map(async (key) => {
        try {
          const params = { size: 10, page: 0 };
          if (key !== "all") {
            params.type = key;
          }
          const res = await leadService.getOverviewLeads(params);
          console.log(`📡 [useLeadCounts] Fetched key '${key}' res:`, res);
          const total = res.totalItems ?? res.totalElements ?? res.page?.totalElements ?? 0;
          console.log(`📡 [useLeadCounts] Key '${key}' parsed total:`, total);
          if (typeof total === "number") {
            liveCounts[key] = total;
          }
        } catch (e) {
          console.error(`📡 [useLeadCounts] Error fetching key '${key}':`, e);
        }
      });

      await Promise.all(fetches);
      console.log("📡 [useLeadCounts] Final liveCounts:", liveCounts);

      return liveCounts;
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  });
}

function mapLeadCounts(data) {
  if (!data) return {};
  
  // Handle direct counts, nested overall, counts object, or stats format
  const stats = data.overall || data.counts || data;
  
  return {
    all: stats.total || stats.all || stats.totalLeads || stats.allLeads || 0,
    new: stats.recent || stats.new || stats.newLeads || 0,
    hot: stats.hot || stats.hotLeads || stats.hot_leads || 0,
    cold: stats.cold || stats.coldLeads || stats.cold_leads || 0,
    alloted: stats.alloted || stats.allotted || stats.allotedLeads || stats.allottedLeads || 0,
    "not-alloted": stats.notAlloted || stats.not_allotted || stats["not-alloted"] || stats.notAllottedLeads || stats.unassigned || 0,
    "not-consulted": stats.notConsulted || stats.not_consulted || stats["not-consulted"] || stats.notConsultedLeads || stats.not_consulted_leads || 0,
    "opinion-reassign": stats.opinionReassign || stats.opinion_reassign || stats["opinion-reassign"] || stats.opinionReassignLeads || stats.opinion_reassign_leads || 0,
  };
}
