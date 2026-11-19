import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { telecallerCallService } from "../services/telecallerCallService";

export const useCalls = (filters = {}, page = 0, size = 10) => {
  return useQuery({
    queryKey: ["telecaller", "calls", filters, page, size],
    queryFn: async () => {
      return await telecallerCallService.getCalls({ page, size, ...filters });
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useInfiniteCalls = (filters = {}, size = 10) => {
  return useInfiniteQuery({
    queryKey: ["telecaller", "calls", "infinite", filters, size],
    queryFn: async ({ pageParam = 0 }) => {
      return await telecallerCallService.getCalls({ pageParam, size, ...filters });
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined;
      // Spring Page object support
      if (lastPage.last === true) return undefined;
      if (Array.isArray(lastPage.content)) {
        if (lastPage.content.length < size) return undefined;
        if (typeof lastPage.totalPages === "number" && allPages.length >= lastPage.totalPages) return undefined;
        return allPages.length;
      }
      // Raw array response support
      if (Array.isArray(lastPage)) {
        if (lastPage.length < size) return undefined;
        return allPages.length;
      }
      return undefined;
    },
    staleTime: 60 * 1000,
  });
};

export const useCallDetails = (callId, options = {}) => {
  return useQuery({
    queryKey: ["telecaller", "call", callId],
    queryFn: async () => {
      return await telecallerCallService.getCallDetails(callId);
    },
    enabled: !!callId && options.enabled !== false,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
