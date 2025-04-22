import { useQuery } from "@tanstack/react-query";
import { refreshTokenApi } from "@/lib/api/auth";

export const useRefreshToken = () => {
  return useQuery({
    queryKey: ["refreshToken"],
    queryFn: refreshTokenApi,
    retry: false,
    refetchOnWindowFocus: false,
  });
};