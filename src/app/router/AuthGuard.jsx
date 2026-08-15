import { Navigate, Outlet, useLocation } from 'react-router'

export default function AuthGuard() {
  const location = useLocation()
  const isAuthenticated = false

  if (!isAuthenticated) {
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
