import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/hooks/useAppToast";
import leadService from "../services/leadService";
import { LEAD_KEYS } from "../constants/queryKeys";
import { handleLeadError } from "../utils/errorHandler";
import { addTelecallerNotification } from "@/features/telecaller/notifications/utils/notificationStorage";

export const useAssignLeads = (onSuccessCallback) => {
  const queryClient = useQueryClient();
  const toast = useAppToast();

  return useMutation({
    mutationFn: leadService.assignLeads,
    onSuccess: (data, variables) => {
      toast.success("Leads Assigned", "Selected leads were assigned successfully.");

      // Automatically register real assigned lead notification
      const leadIds = variables?.enquiryIds || variables?.leadIds || (variables?.enquiryNo ? [variables.enquiryNo] : []);
      if (Array.isArray(leadIds) && leadIds.length > 0) {
        leadIds.forEach((id) => {
          addTelecallerNotification({
            title: "New Lead Assigned",
            description: `Lead #${id} has been assigned to your queue.`,
            enquiryNo: id,
          });
        });
      }

      queryClient.invalidateQueries({ queryKey: LEAD_KEYS.overviewLists() });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({ queryKey: LEAD_KEYS.counts() });
      queryClient.invalidateQueries({ queryKey: LEAD_KEYS.details() });
      queryClient.invalidateQueries({ queryKey: ["allLeadsForWorkload"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["telecaller-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["telecaller-notifications-unread"] });
      if (onSuccessCallback) onSuccessCallback(data);
    },
    onError: (error) => {
      handleLeadError(error, "Failed to assign leads.");
      const msg = error?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error("Failed", msg);
    },
  });
};
