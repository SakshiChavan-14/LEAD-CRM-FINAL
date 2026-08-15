import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/hooks/useAppToast";
import notificationsApi from "../api/notificationsApi";

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const toast = useAppToast();

  return useMutation({
    mutationFn: (id) => notificationsApi.markAsRead(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["telecaller-notifications"] });
      await queryClient.cancelQueries({ queryKey: ["telecaller-notifications-unread"] });

      // Snapshot the previous values
      const previousNotificationsQueries = queryClient.getQueriesData({ queryKey: ["telecaller-notifications"] });
      const previousUnreadCount = queryClient.getQueryData(["telecaller-notifications-unread"]);

      // Optimistically update notifications list
      queryClient.setQueriesData({ queryKey: ["telecaller-notifications"] }, (old) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.map(n => n.id === id ? { ...n, read: true } : n);
        }
        if (old.content) {
          return {
            ...old,
            content: old.content.map(n => n.id === id ? { ...n, read: true } : n)
          };
        }
        return old;
      });

      // Optimistically update unread count safely
      queryClient.setQueryData(["telecaller-notifications-unread"], (old) => {
        const previousCount = typeof old === "number" ? old : 0;
        return Math.max(0, previousCount - 1);
      });

      return { previousNotificationsQueries, previousUnreadCount };
    },
    onError: (err, id, context) => {
      toast.error("Error", "Failed to mark notification as read");
      
      // Rollback notifications
      if (context?.previousNotificationsQueries) {
        context.previousNotificationsQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      // Rollback unread count
      if (context?.previousUnreadCount !== undefined) {
        queryClient.setQueryData(["telecaller-notifications-unread"], context.previousUnreadCount);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["telecaller-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["telecaller-notifications-unread"] });
    },
  });
}
