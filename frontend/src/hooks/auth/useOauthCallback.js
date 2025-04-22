import { useMutation } from "@tanstack/react-query";
import { oauthCallbackApi } from "@/lib/api/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useOauthCallback = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ provider, code }) => oauthCallbackApi(provider, code),
    onSuccess: (res) => {
      toast.success("Login successful");
      navigate(res.twoFactorEnabled ? "/verify-login-2fa" : "/home");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "OAuth failed");
    },
  });
};
