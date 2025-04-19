import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success(data.message || "Login successful");

      // Navigate based on 2FA status in response
      if (data.twoFactorEnabled) {
        navigate("/verify-login-2fa");
      } else {
        navigate("/");
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });
};
