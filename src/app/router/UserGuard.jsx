import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/auth/AuthProvider'

export default function UserGuard() {
  const { session } = useAuth()

  if (!session || session.role !== 'user') {
    return <Navigate to="/auth/login" replace state={{ from: '/user/profile' }} />
  }

  return <Outlet />
}
