import { useMutation } from "@tanstack/react-query";
import { verifyEmail } from "@/lib/api";

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmail,
  });
};
