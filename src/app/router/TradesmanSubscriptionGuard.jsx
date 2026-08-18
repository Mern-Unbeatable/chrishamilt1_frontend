import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '@/auth/AuthProvider'
import { getTradesmanHomePath, hasTradesmanSubscription } from '@/auth/tradesmanSubscription'

export default function TradesmanSubscriptionGuard() {
  const location = useLocation()
  const { session } = useAuth()

  if (!hasTradesmanSubscription(session?.email)) {
    return (
      <Navigate
        to={getTradesmanHomePath(session?.email)}
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return <Outlet />
}
