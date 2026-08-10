import { useMutation } from "@tanstack/react-query";
import { profileApi } from "../api/profileApi";
import { mapPasswordRequest } from "../utils/profileMapper";
import { toast } from "sonner";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const mappedData = mapPasswordRequest(formData);
      return await profileApi.changePassword(mappedData);
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to change password";
      toast.error(message);
    },
  });
};
