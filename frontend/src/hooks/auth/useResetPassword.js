import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi } from "@/lib/api/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: (res) => {
      toast.success(res?.message || "Password has been reset.");
      navigate("/login");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to reset password."),
  });
};