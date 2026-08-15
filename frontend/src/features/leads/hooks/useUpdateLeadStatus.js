import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import API_ENDPOINTS from "@/utils/apiEndpoints";

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ enquiryNo, status, note }) => {
      const { data } = await axiosInstance.patch(API_ENDPOINTS.LEADS.STATUS(enquiryNo), {
        status,
        note,
      });
      console.groupCollapsed("[StatusMutation]");
      console.log("Payload", { enquiryNo, status, note });
      console.log("Response", data);
      console.groupEnd();
      return data;
    },
    // Optimistic Update
    onMutate: async ({ enquiryNo, status }) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["telecaller", "leads"] });
      await queryClient.cancelQueries({ queryKey: ["admin", "lead", enquiryNo] });

      // Snapshot the previous values
      const previousLeads = queryClient.getQueryData(["telecaller", "leads"]);
      
      // Optimistically update the list
      if (previousLeads) {
        queryClient.setQueryData(["telecaller", "leads"], (oldData) => {
          if (!oldData?.leads) return oldData;
          return {
            ...oldData,
            leads: oldData.leads.map((lead) => 
              String(lead.enquiryNo) === String(enquiryNo) 
                ? { ...lead, status } 
                : lead
            )
          };
        });
      }

      // Return context with previous data for rollback
      return { previousLeads };
    },
    // Rollback on error
    onError: (err, newLead, context) => {
      if (context?.previousLeads) {
        queryClient.setQueryData(["telecaller", "leads"], context.previousLeads);
      }
    },
    // Invalidate queries on settlement (success or error)
    onSettled: (data, error, variables) => {
      const { enquiryNo } = variables;
      
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["telecaller"] });
      queryClient.invalidateQueries({ queryKey: ["followups"] });
      queryClient.invalidateQueries({ queryKey: ["lead-status-history"] });
      queryClient.invalidateQueries({ queryKey: ["lead-details", enquiryNo] });
      queryClient.invalidateQueries({ queryKey: ["lead-timeline", enquiryNo] });
    },
  });
};
