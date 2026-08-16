import { Navigate, Outlet } from 'react-router'
import { getDemoSession } from '@/auth/demoAuth'

export default function RoleGuard({ allowedRoles = [] }) {
  const session = getDemoSession()

  if (!session) {
    return <Navigate to="/auth/login" replace />
  }

  if (!allowedRoles.includes(session.role)) {
    return <Navigate to={`/${session.role}/dashboard`} replace />
  }

  return <Outlet />
}
