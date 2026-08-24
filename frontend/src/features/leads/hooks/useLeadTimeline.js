import { useQuery } from "@tanstack/react-query";
import leadService from "../services/leadService";
import { LEAD_KEYS } from "../constants/queryKeys";

export const useLeadTimeline = (leadId) => {
  const cleanId = leadId ? String(leadId).replace(/[^\d]/g, "") : "";
  return useQuery({
    queryKey: LEAD_KEYS.timeline(cleanId),
    queryFn: () => leadService.getLeadTimeline(cleanId),
    enabled: !!cleanId,
  });
};
