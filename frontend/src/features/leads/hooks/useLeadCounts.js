import { useQuery } from "@tanstack/react-query";
import leadService from "../services/leadService";
import { LEAD_KEYS } from "../constants/queryKeys";

export function useLeadCounts() {
  return useQuery({
    queryKey: LEAD_KEYS.counts(),
    queryFn: async () => {
      try {
        const [countsData, leadsRaw] = await Promise.all([
          leadService.getLeadCounts().catch(() => ({})),
          leadService.getOverviewLeads({ size: 10000 }).catch(() => ({}))
        ]);

        console.log("📡 [useLeadCounts] Raw leadCounts from API:", countsData);
        const baseCounts = mapLeadCounts(countsData);

        const leads = leadsRaw?.leads || leadsRaw?.content || (Array.isArray(leadsRaw) ? leadsRaw : []);
        
        // Compute accurate hot, warm, and cold counts from the real leads list
        let hotCount = 0;
        let warmCount = 0;
        let coldCount = 0;

        leads.forEach(l => {
          const statusUpper = (l.status || "").toUpperCase();
          const opinionUpper = (l.opinion || l.temperature || "").toUpperCase();
          if (statusUpper === "HOT" || opinionUpper === "HOT" || opinionUpper === "INTERESTED") {
            hotCount++;
          } else if (statusUpper === "COLD" || opinionUpper === "COLD" || opinionUpper === "NOT INTERESTED") {
            coldCount++;
          } else {
            warmCount++;
          }
        });

        // Override with accurate client-computed counts
        baseCounts.hot = hotCount;
        baseCounts.warm = warmCount;
        baseCounts.cold = coldCount;

        console.log("📡 [useLeadCounts] Mapped baseCounts with dynamic hot/warm/cold override:", baseCounts);
        return baseCounts;
      } catch (e) {
        console.error("📡 [useLeadCounts] Error fetching base counts:", e);
        return {
          all: 0,
          new: 0,
          hot: 0,
          warm: 0,
          cold: 0,
          alloted: 0,
          "not-alloted": 0,
          "not-consulted": 0,
          "opinion-reassign": 0,
        };
      }
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
    warm: stats.warm || stats.warmLeads || stats.warm_leads || 0,
    cold: stats.cold || stats.coldLeads || stats.cold_leads || 0,
    alloted: stats.alloted || stats.allotted || stats.allotedLeads || stats.allottedLeads || 0,
    "not-alloted": stats.notAlloted || stats.not_allotted || stats["not-alloted"] || stats.notAllottedLeads || stats.unassigned || 0,
    "not-consulted": stats.notConsulted || stats.not_consulted || stats["not-consulted"] || stats.notConsultedLeads || stats.not_consulted_leads || 0,
    "opinion-reassign": stats.opinionReassign || stats.opinion_reassign || stats["opinion-reassign"] || stats.opinionReassignLeads || stats.opinion_reassign_leads || 0,
  };
}
