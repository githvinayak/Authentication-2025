import { enable2FAApi } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useEnable2FA = () => {
  return useMutation({
    mutationFn: enable2FAApi,
    onSuccess: (res) => {
      toast.success(res?.message || "OTP sent to your email.");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to send OTP.");
    },
  });
};
