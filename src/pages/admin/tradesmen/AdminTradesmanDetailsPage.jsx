import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import { getAdminTradesmanDetail } from '@/data/adminTradesmanDetailData'
import { submitAdminUserStatus } from '@/helpers/submitAdminUserStatus'
import AdminTradesmanCompletedJobsCard from '@/pages/admin/tradesmen/sections/AdminTradesmanCompletedJobsCard'
import AdminTradesmanPerformanceCard from '@/pages/admin/tradesmen/sections/AdminTradesmanPerformanceCard'
import AdminTradesmanProfileHeader, {
  AdminTradesmanBackLink,
} from '@/pages/admin/tradesmen/sections/AdminTradesmanProfileHeader'
import AdminTradesmanReviewsPanel from '@/pages/admin/tradesmen/sections/AdminTradesmanReviewsPanel'
import AdminTradesmanTokenCard from '@/pages/admin/tradesmen/sections/AdminTradesmanTokenCard'
import {
  fetchAdminTradesmanDetail,
  grantAdminTradesmanTokens,
  isAdminTradesmenApiEnabled,
} from '@/services/adminTradesmenApi'
import { showApiErrorFromError, showSuccessAlert } from '@/helpers/showAppAlert'
import { ADMIN_USER_STATUS } from '@/services/adminUsersApi'

export default function AdminTradesmanDetailsPage() {
  const { tradesmanId } = useParams()
  const useApi = isAdminTradesmenApiEnabled()

  const [tradesman, setTradesman] = useState(
    useApi ? null : getAdminTradesmanDetail(tradesmanId),
  )
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)
  const [grantingTokens, setGrantingTokens] = useState(false)

  useEffect(() => {
    if (!useApi) {
      setTradesman(getAdminTradesmanDetail(tradesmanId))
      setLoading(false)
      return undefined
    }

    let cancelled = false

    async function loadDetail() {
      setLoading(true)
      setError('')

      try {
        const data = await fetchAdminTradesmanDetail(tradesmanId)
        if (cancelled) return
        setTradesman(data)
      } catch (err) {
        if (cancelled) return
        // If API fails, attempt fallback to demo data if available
        const fallback = getAdminTradesmanDetail(tradesmanId)
        if (fallback) {
          setTradesman(fallback)
        } else {
          setError(err?.message || 'Failed to load tradesman details.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDetail()

    return () => {
      cancelled = true
    }
  }, [useApi, tradesmanId])

  const handleSuspend = async () => {
    if (!tradesman || updating) return

    if (!useApi) {
      setTradesman((current) => (current ? { ...current, status: 'Suspend' } : current))
      return
    }

    setUpdating(true)
    try {
      const displayStatus = await submitAdminUserStatus(tradesman.id, ADMIN_USER_STATUS.SUSPENDED, {
        successText: 'Tradesman account has been suspended.',
      })
      if (displayStatus) {
        setTradesman((current) => (current ? { ...current, status: displayStatus } : current))
      }
    } finally {
      setUpdating(false)
    }
  }

  const handleSetActive = async () => {
    if (!tradesman || updating) return

    if (!useApi) {
      setTradesman((current) => (current ? { ...current, status: 'Active' } : current))
      return
    }

    setUpdating(true)
    try {
      const displayStatus = await submitAdminUserStatus(tradesman.id, ADMIN_USER_STATUS.ACTIVE, {
        successText: 'Tradesman account is now active.',
      })
      if (displayStatus) {
        setTradesman((current) => (current ? { ...current, status: displayStatus } : current))
      }
    } finally {
      setUpdating(false)
    }
  }

  const handleGrantTokens = async (amount) => {
    if (!useApi) return true

    setGrantingTokens(true)

    try {
      await grantAdminTradesmanTokens(tradesmanId, amount)
      const updated = await fetchAdminTradesmanDetail(tradesmanId)
      setTradesman(updated)
      await showSuccessAlert({
        title: 'Tokens granted',
        text: `${amount} tokens added to the tradesman's wallet.`,
      })
      return true
    } catch (err) {
      await showApiErrorFromError(err, 'Unable to grant tokens')
      return false
    } finally {
      setGrantingTokens(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminTradesmanBackLink />
        <div className="flex items-center justify-center py-16">
          <div className="size-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      </div>
    )
  }

  if (error || !tradesman) {
    return (
      <div className="space-y-6">
        <AdminTradesmanBackLink />
        <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
          {error || 'Tradesman not found.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DashboardPageHeader
        title="Tradesmen"
        description="Monitor every tradesman on the platform — their token balance, quote activity, and account standing."
      />

      <div className="space-y-3">
        <AdminTradesmanBackLink />

        <AdminTradesmanProfileHeader
          tradesman={tradesman}
          onSuspend={handleSuspend}
          onSetActive={handleSetActive}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:items-start">
        <div className="space-y-4">
          <AdminTradesmanPerformanceCard
            stats={tradesman.stats}
            memberSince={tradesman.memberSince}
          />
          <AdminTradesmanTokenCard
            tokens={tradesman.tokens}
            onGrantTokens={useApi ? handleGrantTokens : undefined}
            granting={grantingTokens}
          />
          <AdminTradesmanCompletedJobsCard completedJobs={tradesman.completedJobs} />
        </div>

        <AdminTradesmanReviewsPanel reviews={tradesman.reviews} />
      </div>
    </div>
  )
}

