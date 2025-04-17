import { disable2FA } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

export const useDisable2FA = () => {
  return useMutation({
    mutationFn: disable2FA,
    onSuccess: (data) => {
      toast.success(data.message || "2FA disabled successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to disable 2FA");
    },
  });
};
