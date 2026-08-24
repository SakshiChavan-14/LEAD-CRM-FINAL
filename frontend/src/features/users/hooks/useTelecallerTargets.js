import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { telecallerTargetsService } from "../services/telecallerTargetsService";
import { toast } from "sonner";

export const useTelecallerTargets = () => {
  return useQuery({
    queryKey: ["telecallerTargets"],
    queryFn: telecallerTargetsService.getTargets,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateTelecallerTargets = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: telecallerTargetsService.updateTargets,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["telecallerTargets"] });
      // Invalidate dashboard queries as targets might change
      queryClient.invalidateQueries({ queryKey: ["telecallerDashboard"] });
      toast.success("Targets updated successfully");
      options.onSuccess?.(data);
    },
    onError: (error) => {
      console.error("Failed to update targets:", error);
      toast.error("Failed to update targets");
      options.onError?.(error);
    }
  });
};
