import { useQuery } from "@tanstack/react-query";
import notificationsApi from "../api/notificationsApi";
import useAuthStore from "@/store/authStore";
import { ROLES } from "@/constants/roles";

export function useNotifications(page = 0, size = 10, options = {}) {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.userGroup || user?.role;
  const isTelecaller = userRole === ROLES.TELE_CALLER || (typeof window !== "undefined" && window.location.pathname.startsWith("/telecaller"));

  return useQuery({
    queryKey: ["telecaller-notifications", page, size],
    queryFn: () => notificationsApi.getNotifications(page, size),
    enabled: isTelecaller && (options.enabled ?? true),
    staleTime: 60000,
    retry: false,
  });
}
