import { Navigate, Outlet } from 'react-router'

export default function RoleGuard({ allowedRoles = [] }) {
  const userRole = null

  if (!userRole) {
    return <Navigate to="/auth/login" replace />
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/auth/login" replace />
  }

  return <Outlet />
}
