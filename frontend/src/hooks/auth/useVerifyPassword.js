import { useMutation } from "@tanstack/react-query";
import { verifyPassword } from "@/api/user/verifyPassword";
import { toast } from "sonner";

export const useVerifyPassword = () => {
  return useMutation({
    mutationFn: verifyPassword,
    onSuccess: () => {
      toast.success("Password verified");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Password verification failed");
    },
  });
};