import { useQuery } from "@tanstack/react-query";
import leadService from "../services/leadService";
import { LEAD_KEYS } from "../constants/queryKeys";

export const useLeadDetails = (enquiryNo) => {
  const cleanId = enquiryNo ? String(enquiryNo).replace(/[^\d]/g, "") : "";
  return useQuery({
    queryKey: LEAD_KEYS.detail(cleanId),
    queryFn: () => leadService.getLeadDetails(cleanId),
    enabled: !!cleanId,
  });
};
