import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useAuth } from '@/auth/AuthProvider'
import { AUTH_CONFIG } from '@/auth/authConfig'
import {
  activateTradesmanSubscription,
  getTradesmanHomePath,
  hasTradesmanSubscription,
  syncTradesmanAccessFromWallet,
} from '@/auth/tradesmanSubscription'
import { showApiErrorFromError } from '@/helpers/showAppAlert'
import PricingHero from '@/pages/public/pricing/sections/PricingHero'
import PricingPlans from '@/pages/public/pricing/sections/PricingPlans'
import {
  confirmTokenPackageCheckout,
  isTradesmanWalletApiEnabled,
  startTokenPackageCheckout,
} from '@/services/tradesmanWalletApi'

export default function TradesmanChoosePlanPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { session } = useAuth()
  const email = session?.email ?? ''
  const useApi = isTradesmanWalletApiEnabled() && !AUTH_CONFIG.useDemoAuth

  const [checkoutPackageId, setCheckoutPackageId] = useState('')
  const [notice, setNotice] = useState('')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function ensureAccess() {
      if (hasTradesmanSubscription(email)) {
        if (!cancelled) navigate(getTradesmanHomePath(email), { replace: true })
        return
      }

      if (useApi) {
        const ok = await syncTradesmanAccessFromWallet(email)
        if (ok && !cancelled) {
          navigate('/tradesman/dashboard', { replace: true })
          return
        }
      }

      if (!cancelled) setChecking(false)
    }

    ensureAccess()

    return () => {
      cancelled = true
    }
  }, [email, navigate, useApi])

  useEffect(() => {
    if (!useApi || checking) return undefined

    const status = searchParams.get('status')
    const sessionId = searchParams.get('session_id')
    if (!status && !sessionId) return undefined

    let cancelled = false

    async function handleReturnFromCheckout() {
      if (status === 'cancelled') {
        setNotice('Checkout was cancelled. Choose a package when you are ready.')
        setSearchParams({}, { replace: true })
        return
      }

      try {
        if (sessionId) {
          await confirmTokenPackageCheckout(sessionId)
        }

        activateTradesmanSubscription(email, sessionId || 'checkout')
        if (!cancelled) {
          navigate('/tradesman/dashboard', { replace: true })
        }
      } catch (err) {
        if (!cancelled) {
          setNotice(err?.message || 'Payment confirmation failed. Contact support if tokens are missing.')
          setSearchParams({}, { replace: true })
        }
      }
    }

    handleReturnFromCheckout()

    return () => {
      cancelled = true
    }
  }, [checking, email, navigate, searchParams, setSearchParams, useApi])

  const handleSelectPlan = async (plan) => {
    if (!useApi) {
      activateTradesmanSubscription(email, plan.id)
      navigate('/tradesman/dashboard', { replace: true })
      return
    }

    setCheckoutPackageId(plan.id)
    setNotice('')

    try {
      const checkout = await startTokenPackageCheckout(plan.id)
      window.location.assign(checkout.checkoutUrl)
    } catch (err) {
      setCheckoutPackageId('')
      await showApiErrorFromError(err, 'Unable to start checkout')
    }
  }

  const handleSkip = () => {
    activateTradesmanSubscription(email, 'skipped')
    navigate('/tradesman/dashboard', { replace: true })
  }

  if (checking) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6">
        <p className="text-sm text-[#64748B]">Loading your plan options…</p>
      </div>
    )
  }

  return (
    <>
      <Link
        to="/"
        className="fixed top-5 left-6 z-50 flex items-center gap-1.5 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>

      <button
        type="button"
        onClick={handleSkip}
        className="fixed top-5 right-6 z-50 flex items-center gap-1.5 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
      >
        Skip
        <ArrowRight className="size-4" />
      </button>

      <PricingHero />

      {notice ? (
        <div className="container mx-auto px-6 lg:px-8">
          <p className="mx-auto mb-4 max-w-3xl rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-center text-sm text-[#92400E]">
            {notice}
          </p>
        </div>
      ) : null}

      <PricingPlans
        onSelectPlan={handleSelectPlan}
        buyLabel="Get started"
        checkoutPackageId={checkoutPackageId}
      />
    </>
  )
}
