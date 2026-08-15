import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/hooks/useAppToast";
import leadImportApi from "../api/leadImportApi";
import { LEAD_KEYS } from "@/features/leads/constants/queryKeys";

const TERMINAL_STATUSES = ["COMPLETED", "FAILED", "PARTIAL_SUCCESS"];

export function useLeadImport() {
  const [jobId, setJobId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stage, setStage] = useState("idle"); // idle | uploading | processing | completed | error
  const [customError, setCustomError] = useState(null);

  const queryClient = useQueryClient();
  const toast = useAppToast();

  const handleSuccessInvalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["telecaller-leads"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["recent-leads"] });
    queryClient.invalidateQueries({ queryKey: ["reports-analytics"] });
    queryClient.invalidateQueries({ queryKey: LEAD_KEYS.overviewLists() });
    queryClient.invalidateQueries({ queryKey: LEAD_KEYS.counts() });
  }, [queryClient]);

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: ({ file, autoAssign }) =>
      leadImportApi.uploadCsv(file, autoAssign, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || file.size)
        );
        setUploadProgress(percentCompleted);
      }),
    onMutate: () => {
      setStage("uploading");
      setUploadProgress(0);
      setCustomError(null);
    },
    onSuccess: (res) => {
      const returnedJobId = res?.data?.jobId || res?.jobId;
      if (returnedJobId) {
        setJobId(returnedJobId);
        setStage("processing");
      } else {
        // If response directly contains completed import stats without jobId
        setStage("completed");
        handleSuccessInvalidate();
        toast.success("Import Successful", "Leads imported successfully.");
      }
    },
    onError: (err) => {
      setStage("error");
      const msg = err?.response?.data?.message || "CSV upload failed. Please check your file.";
      setCustomError(msg);
      toast.error("Upload Failed", msg);
    },
  });

  // Polling for job status
  const statusQuery = useQuery({
    queryKey: ["lead-import-status", jobId],
    queryFn: () => leadImportApi.getImportStatus(jobId),
    enabled: Boolean(jobId) && stage === "processing",
    refetchInterval: (query) => {
      const data = query.state.data?.data || query.state.data;
      const currentStatus = data?.status;
      if (currentStatus && TERMINAL_STATUSES.includes(currentStatus)) {
        return false;
      }
      return 2500; // Poll every 2.5s
    },
  });

  const statusData = statusQuery.data?.data || statusQuery.data;

  // Watch status change
  useEffect(() => {
    if (!statusData?.status) return;

    if (statusData.status === "COMPLETED" || statusData.status === "PARTIAL_SUCCESS") {
      setStage("completed");
      handleSuccessInvalidate();
      toast.success(
        "Import Successful",
        `Processed ${statusData.totalRows || statusData.insertedRows || 0} leads.`
      );
    } else if (statusData.status === "FAILED") {
      setStage("error");
      const msg = statusData.message || "Import processing failed.";
      setCustomError(msg);
      toast.error("Import Failed", msg);
    }
  }, [statusData, handleSuccessInvalidate, toast]);

  const startImport = useCallback(
    (file, autoAssign) => {
      uploadMutation.mutate({ file, autoAssign });
    },
    [uploadMutation]
  );

  const reset = useCallback(() => {
    setJobId(null);
    setUploadProgress(0);
    setStage("idle");
    setCustomError(null);
  }, []);

  return {
    startImport,
    reset,
    stage, // idle | uploading | processing | completed | error
    isUploading: uploadMutation.isPending,
    isPolling: statusQuery.isFetching && stage === "processing",
    isCompleted: stage === "completed",
    isError: stage === "error",
    uploadProgress,
    statusData,
    error: customError || uploadMutation.error || statusQuery.error,
  };
}
