import { useAuth } from "@/hooks/user/useAuth"
import { Navigate } from "react-router-dom"

export const AuthRedirect = ({ children }) => {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? <Navigate to="/" replace /> : children
}
