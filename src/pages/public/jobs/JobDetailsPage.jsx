import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { ArrowLeft, Lock } from 'lucide-react'
import JobDetails from '@/components/data-display/JobDetails'
import { DEMO_JOB_DETAILS } from '@/data/demoData'
import JobDetailsBreadcrumbs from '@/pages/public/jobs/sections/JobDetailsBreadcrumbs'
import JobDetailsCustomer from '@/pages/public/jobs/sections/JobDetailsCustomer'
import JobDetailsSummary from '@/pages/public/jobs/sections/JobDetailsSummary'
import { getAccessToken } from '@/auth/authService'
import { useAuth } from '@/auth/AuthProvider'
import {
  fetchPublicJobDetails,
  isPublicJobsApiEnabled,
} from '@/services/publicJobsApi'

export default function JobDetailsPage() {
  const { jobId } = useParams()
  const { session } = useAuth()
  const useApi = isPublicJobsApiEnabled()

  if (session?.role === 'tradesman') {
    return <Navigate to={`/tradesman/browse-jobs/${jobId}`} replace />
  }

  const [job, setJob] = useState(useApi ? null : DEMO_JOB_DETAILS)
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!useApi) {
      setJob(DEMO_JOB_DETAILS)
      setLoading(false)
      setError('')
      return undefined
    }

    let cancelled = false

    async function loadJob() {
      setLoading(true)
      setError('')

      try {
        const data = await fetchPublicJobDetails(jobId, { token: getAccessToken() })
        if (!cancelled) setJob(data)
      } catch (err) {
        if (!cancelled) {
          setJob(null)
          setError(err?.message || 'Unable to load job details.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadJob()

    return () => {
      cancelled = true
    }
  }, [useApi, jobId])

  if (loading) {
    return (
      <section className="bg-[#F8FAFC] py-8 lg:py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
            <p className="text-sm text-[#64748B]">Loading job details…</p>
          </div>
        </div>
      </section>
    )
  }

  const isAuthOrTradesmanRequired =
    !session ||
    session.role !== 'tradesman' ||
    error?.toLowerCase().includes('authentication') ||
    error?.toLowerCase().includes('authorized') ||
    error?.toLowerCase().includes('token') ||
    error?.includes('401') ||
    error?.includes('403')

  if (error || !job) {
    if (isAuthOrTradesmanRequired) {
      const isCustomer = session?.role === 'user'

      return (
        <section className="bg-[#F8FAFC] py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-7 sm:p-9 text-center shadow-xs">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#EFF6FF] text-btn-primary">
                <Lock className="size-5" strokeWidth={2.2} />
              </div>

              <h2 className="mt-4 text-lg font-bold tracking-tight text-[#0F172A] sm:text-xl">
                Tradesman Access Required
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#64748B]">
                {isCustomer
                  ? 'You are signed in as a Customer. Job leads and quotation requests are exclusively accessible to verified tradesmen.'
                  : 'This lead is exclusively available to verified tradesmen. Sign in to your account or register today to view details and submit a quote.'}
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                {isCustomer ? (
                  <Link
                    to="/register?role=tradesman"
                    className="w-full sm:w-auto inline-flex h-10 items-center justify-center rounded-lg bg-btn-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
                  >
                    Register as Tradesman
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      state={{ from: `/tradesman/browse-jobs/${jobId}` }}
                      className="w-full sm:w-auto inline-flex h-10 items-center justify-center rounded-lg bg-btn-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register?role=tradesman"
                      className="w-full sm:w-auto inline-flex h-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white px-5 text-sm font-semibold text-[#1E293B] transition-colors hover:bg-[#F8FAFC]"
                    >
                      Join as Tradesman
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-6">
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] transition-colors hover:text-[#0F172A]"
                >
                  <ArrowLeft className="size-3.5" />
                  Back to Browse Jobs
                </Link>
              </div>
            </div>
          </div>
        </section>
      )
    }

    return (
      <section className="bg-[#F8FAFC] py-8 lg:py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-md mx-auto rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-8 text-center">
            <h2 className="text-lg font-bold text-[#B91C1C]">Job not found</h2>
            <p className="mt-2 text-sm text-[#991B1B]">
              {error || 'This job lead may have been removed or is no longer available.'}
            </p>
            <Link
              to="/jobs"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-btn-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
            >
              Back to Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const isOpenJob =
    String(job.statusCode || job.status || '')
      .trim()
      .toUpperCase()
      .replace(/[\s-]+/g, '_') === 'OPEN'

  if (!isOpenJob) {
    return (
      <section className="bg-[#F8FAFC] py-8 lg:py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-12 text-center">
            <p className="text-base font-semibold text-[#111827]">
              This job is no longer open
            </p>
            <p className="mt-2 text-sm text-[#64748B]">
              Only open jobs are available for browsing and quotes.
            </p>
            <Link
              to="/jobs"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-btn-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
            >
              Back to Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const isOwner = Boolean(
    session?.id && (session.id === job.customerId || session.id === job.customer?.id),
  )

  return (
    <section className="bg-[#F8FAFC] py-8 lg:py-12">
      <div className="container mx-auto px-6 lg:px-8">
        <JobDetailsBreadcrumbs category={job.category} />

        <div className="space-y-6">
          <JobDetailsSummary job={job} />

          {isOwner && job.customer ? (
            <JobDetailsCustomer
              customer={job.customer}
              isLocked={false}
              showLockedPrompt={false}
            />
          ) : null}

          <JobDetails
            job={job}
            showSummary={false}
            showTradesman={false}
            isLocked={!isOwner}
            showLockedPrompt={false}
          />
        </div>
      </div>
    </section>
  )
}
