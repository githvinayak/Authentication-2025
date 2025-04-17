// hooks/useAuth.js

import { useGetProfile } from "./useGetProfile"

export const useAuth = () => {
  const { data: profile, isLoading } = useGetProfile()
  const isAuthenticated = profile

  return { isAuthenticated, profile, isLoading }
}