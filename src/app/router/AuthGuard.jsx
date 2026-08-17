import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '@/auth/AuthProvider'

export default function AuthGuard() {
  const location = useLocation()
  const { session } = useAuth()

  if (!session) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return <Outlet />
}
