import { useQuery } from "@tanstack/react-query";
import { callHistoryService } from "../services/callHistoryService";

export function useCallHistory(params = {}) {
  const { page = 0, size = 100, search = "" } = params;

  return useQuery({
    queryKey: ["telecaller-calls", page, size, search],
    queryFn: () => callHistoryService.getCallHistory({ page, size, search }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}
