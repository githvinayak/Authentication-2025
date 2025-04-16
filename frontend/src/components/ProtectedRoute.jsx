import { useAuth } from "@/hooks/user/useAuth"
import { Navigate, Outlet, useLocation } from "react-router-dom"

 const PrivateRoute = () => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location }} replace />
}

export default PrivateRoute;