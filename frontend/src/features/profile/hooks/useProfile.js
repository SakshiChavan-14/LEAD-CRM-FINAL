import { useQuery } from "@tanstack/react-query";
import { profileApi } from "../api/profileApi";
import { mapProfile } from "../utils/profileMapper";
import { PROFILE_KEYS } from "../constants/profileKeys";

export const useProfile = () => {
  return useQuery({
    queryKey: PROFILE_KEYS.me(),
    queryFn: async () => {
      const data = await profileApi.getProfile();
      return mapProfile(data?.data || data); // handle potential double-data wrap depending on backend
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
