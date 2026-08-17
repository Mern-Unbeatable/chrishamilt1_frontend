import { Navigate, Outlet } from 'react-router'
import { getDemoSession, getDashboardHome } from '@/auth/demoAuth'

export default function RoleGuard({ allowedRoles = [] }) {
  const session = getDemoSession()

  if (!session) {
    return <Navigate to="/auth/login" replace />
  }

  if (!allowedRoles.includes(session.role)) {
    return <Navigate to={getDashboardHome(session.role)} replace />
  }

  return <Outlet />
}
