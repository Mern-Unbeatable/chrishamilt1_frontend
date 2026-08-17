import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/auth/AuthProvider'
import { getDashboardHome } from '@/auth/authService'

export default function RoleGuard({ allowedRoles = [] }) {
  const { session } = useAuth()

  if (!session) {
    return <Navigate to="/auth/login" replace />
  }

  if (!allowedRoles.includes(session.role)) {
    return <Navigate to={getDashboardHome(session.role)} replace />
  }

  return <Outlet />
}
