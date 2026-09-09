import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '@/auth/AuthProvider'
import { AUTH_CONFIG } from '@/auth/authConfig'
import {
  getTradesmanHomePath,
  hasTradesmanSubscription,
  syncTradesmanAccessFromWallet,
} from '@/auth/tradesmanSubscription'

export default function TradesmanSubscriptionGuard() {
  const location = useLocation()
  const { session } = useAuth()
  const email = session?.email ?? ''
  const useApi = Boolean(AUTH_CONFIG.apiBaseUrl) && !AUTH_CONFIG.useDemoAuth

  const [allowed, setAllowed] = useState(() => hasTradesmanSubscription(email))
  const [checking, setChecking] = useState(useApi && !hasTradesmanSubscription(email))

  useEffect(() => {
    if (hasTradesmanSubscription(email)) {
      setAllowed(true)
      setChecking(false)
      return undefined
    }

    if (!useApi) {
      setAllowed(false)
      setChecking(false)
      return undefined
    }

    let cancelled = false

    async function checkAccess() {
      setChecking(true)
      const ok = await syncTradesmanAccessFromWallet(email)
      if (!cancelled) {
        setAllowed(ok)
        setChecking(false)
      }
    }

    checkAccess()

    return () => {
      cancelled = true
    }
  }, [email, useApi])

  if (checking) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-6">
        <p className="text-sm text-[#64748B]">Checking your account access…</p>
      </div>
    )
  }

  if (!allowed) {
    return (
      <Navigate
        to={getTradesmanHomePath(email)}
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return <Outlet />
}
