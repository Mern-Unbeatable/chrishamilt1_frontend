import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/auth/AuthProvider'
import { getDashboardHome } from '@/auth/authService'

export default function GuestGuard() {
  const { session } = useAuth()

  if (!session) {
    return <Outlet />
  }

  if (session.role === 'user') {
    return <Navigate to="/" replace />
  }

  return <Navigate to={getDashboardHome(session.role)} replace />
}
