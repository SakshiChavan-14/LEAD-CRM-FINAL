import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profileApi";
import { PROFILE_KEYS } from "../constants/profileKeys";
import { mapProfileUpdate } from "../utils/profileMapper";
import { toast } from "sonner";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const mappedData = mapProfileUpdate(formData);
      return await profileApi.updateProfile(mappedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.me() });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    },
  });
};
