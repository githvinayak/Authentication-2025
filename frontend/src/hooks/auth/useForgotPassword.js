import { useMutation } from "@tanstack/react-query";
import { forgotPasswordApi } from "@/lib/api/auth";
import { toast } from "sonner";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: (res) => toast.success(res?.message || "OTP sent to your email."),
    onError: (err) => toast.error(err?.response?.data?.message || "Something went wrong."),
  });
};