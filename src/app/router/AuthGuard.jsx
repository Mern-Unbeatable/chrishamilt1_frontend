import { Navigate, Outlet, useLocation } from 'react-router'
import { getDemoSession } from '@/auth/demoAuth'

export default function AuthGuard() {
  const location = useLocation()
  const session = getDemoSession()

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
