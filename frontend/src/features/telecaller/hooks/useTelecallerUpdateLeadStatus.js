import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import API_ENDPOINTS from "@/utils/apiEndpoints";
import { toast } from "sonner";

export const useTelecallerUpdateLeadStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ enquiryNo, status, note }) => {
      try {
        const { data } = await axiosInstance.patch(
          API_ENDPOINTS.TELECALLER.LEAD_DETAILS(enquiryNo),
          { status, note }
        );
        return data;
      } catch (err) {
        if (err?.response?.status === 404) {
          const { data } = await axiosInstance.patch(
            API_ENDPOINTS.TELECALLER.LEAD_STATUS(enquiryNo),
            { status, note }
          );
          return data;
        }
        throw err;
      }
    },

    onMutate: async ({ enquiryNo, status }) => {
      // Cancel queries to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["telecaller", "leads"] });
      await queryClient.cancelQueries({ queryKey: ["telecaller", "lead", enquiryNo] });

      // Snapshot previous data for rollback
      const previousLeadsQueries = queryClient.getQueriesData({ queryKey: ["telecaller", "leads"] });
      const previousDetail = queryClient.getQueryData(["telecaller", "lead", enquiryNo]);

      // Optimistically update list queries
      queryClient.setQueriesData({ queryKey: ["telecaller", "leads"] }, (oldData) => {
        if (!oldData) return oldData;
        if (Array.isArray(oldData)) {
          return oldData.map((lead) =>
            String(lead.enquiryNo || lead.id) === String(enquiryNo)
              ? { ...lead, status }
              : lead
          );
        }
        if (oldData.leads && Array.isArray(oldData.leads)) {
          return {
            ...oldData,
            leads: oldData.leads.map((lead) =>
              String(lead.enquiryNo || lead.id) === String(enquiryNo)
                ? { ...lead, status }
                : lead
            ),
          };
        }
        return oldData;
      });

      // Optimistically update detail query
      if (previousDetail) {
        queryClient.setQueryData(["telecaller", "lead", enquiryNo], (old) => {
          if (!old) return old;
          return { ...old, status: typeof old.status === 'object' ? { ...old.status, stage: status } : status };
        });
      }

      return { previousLeadsQueries, previousDetail };
    },

    onSuccess: () => {
      toast.success("Lead status updated successfully");
    },

    onError: (err, variables, context) => {
      // Rollback optimistic state
      if (context?.previousLeadsQueries) {
        context.previousLeadsQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(["telecaller", "lead", variables.enquiryNo], context.previousDetail);
      }

      const errMsg = err?.response?.data?.message || err?.message || "Failed to update lead status";
      if (err?.response?.status === 403) {
        console.error("[Status Update Error 403]", err);
        toast.error("Access Denied (403)", { description: "You are not authorized to update this lead's status." });
      } else {
        console.error("[Status Update Error]", err);
        toast.error("Status Update Failed", { description: errMsg });
      }
    },

    onSettled: (_data, _error, variables) => {
      const { enquiryNo } = variables;
      queryClient.invalidateQueries({ queryKey: ["telecaller", "leads"] });
      queryClient.invalidateQueries({ queryKey: ["telecaller", "lead", enquiryNo] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["followups"] });
      queryClient.invalidateQueries({ queryKey: ["lead-status-history", enquiryNo] });
      queryClient.invalidateQueries({ queryKey: ["telecaller", "timeline", enquiryNo] });
      queryClient.invalidateQueries({ queryKey: ["lead-timeline", enquiryNo] });
      queryClient.invalidateQueries({ queryKey: ["telecallerDashboard"] });
    },
  });
};

