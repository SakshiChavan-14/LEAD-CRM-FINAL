import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppToast } from "@/hooks/useAppToast";
import notificationsApi from "../api/notificationsApi";

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  const toast = useAppToast();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["telecaller-notifications"] });
      await queryClient.cancelQueries({ queryKey: ["telecaller-notifications-unread"] });

      // Snapshot previous states
      const previousNotificationsQueries = queryClient.getQueriesData({ queryKey: ["telecaller-notifications"] });
      const previousUnreadCount = queryClient.getQueryData(["telecaller-notifications-unread"]);

      // Optimistically mark all visible notifications as read
      queryClient.setQueriesData({ queryKey: ["telecaller-notifications"] }, (old) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.map(n => ({ ...n, read: true }));
        }
        if (old.content) {
          return {
            ...old,
            content: old.content.map(n => ({ ...n, read: true }))
          };
        }
        return old;
      });

      // Optimistically set unread count to 0
      queryClient.setQueryData(["telecaller-notifications-unread"], 0);

      return { previousNotificationsQueries, previousUnreadCount };
    },
    onSuccess: () => {
      toast.success("Notifications", "All notifications marked as read");
    },
    onError: (err, variables, context) => {
      toast.error("Error", "Failed to mark all notifications as read");
      
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
