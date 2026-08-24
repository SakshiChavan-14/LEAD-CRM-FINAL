import { useQuery } from "@tanstack/react-query";
import leadService from "../services/leadService";
import { LEAD_KEYS } from "../constants/queryKeys";

export const useLeadNotes = (leadId) => {
  const cleanId = leadId ? String(leadId).replace(/[^\d]/g, "") : "";
  return useQuery({
    queryKey: LEAD_KEYS.notes(cleanId),
    queryFn: () => leadService.getLeadNotes(cleanId),
    enabled: !!cleanId,
  });
};
