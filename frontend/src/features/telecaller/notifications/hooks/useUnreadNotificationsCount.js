import { useQuery, keepPreviousData } from "@tanstack/react-query";
import notificationsApi from "../api/notificationsApi";
import useAuthStore from "@/store/authStore";
import { ROLES } from "@/constants/roles";

export function useUnreadNotificationsCount(options = {}) {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.userGroup || user?.role;
  const isTelecaller = userRole === ROLES.TELE_CALLER || (typeof window !== "undefined" && window.location.pathname.startsWith("/telecaller"));

  return useQuery({
    queryKey: ["telecaller-notifications-unread"],
    queryFn: () => notificationsApi.getUnreadCount(),
    enabled: isTelecaller && (options.enabled ?? true),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    retry: false,
  });
}
