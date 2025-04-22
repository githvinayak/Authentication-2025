import { verify2FA } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useVerify2FA = () => {
  return useMutation({
    mutationFn: verify2FA,
    onSuccess: (data) => {
      toast.success(data.message || "2FA verified successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to verify 2FA");
    },
  });
};