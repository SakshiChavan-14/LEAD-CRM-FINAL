import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profileApi";
import { PROFILE_KEYS } from "../constants/profileKeys";
import { mapAvatarUpload } from "../utils/profileMapper";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const updateAuthUser = useAuthStore((state) => state.updateUser); // assuming authStore allows partial updates

  return useMutation({
    mutationFn: async (file) => {
      const formData = mapAvatarUpload(file);
      return await profileApi.uploadAvatar(formData);
    },
    onSuccess: (data) => {
      // Invalidate the profile cache
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.me() });
      
      // If the backend returns the new avatar URL, update the auth store directly
      if (data?.data?.avatarUrl || data?.avatarUrl || data?.avatar) {
        updateAuthUser({ avatar: data?.data?.avatarUrl || data?.avatarUrl || data?.avatar });
      }

      toast.success("Avatar uploaded successfully");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to upload avatar";
      toast.error(message);
    },
  });
};
