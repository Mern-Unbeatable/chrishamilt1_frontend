import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useAuth } from '@/auth/AuthProvider'
import JobDetails from '@/components/data-display/JobDetails'
import { DEMO_JOB_DETAILS } from '@/data/demoData'
import JobDetailsBreadcrumbs from '@/pages/public/jobs/sections/JobDetailsBreadcrumbs'
import JobDetailsCustomer from '@/pages/public/jobs/sections/JobDetailsCustomer'
import JobDetailsSummary from '@/pages/public/jobs/sections/JobDetailsSummary'
import {
  fetchPublicJobDetails,
  isPublicJobsApiEnabled,
} from '@/services/publicJobsApi'

export default function JobDetailsPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const useApi = isPublicJobsApiEnabled()

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
        const data = await fetchPublicJobDetails(jobId)
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

  const handleSendQuote = () => navigate('/auth/login')

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

  if (error || !job) {
    return (
      <section className="bg-[#F8FAFC] py-8 lg:py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-6 py-12 text-center">
            <p className="text-base font-semibold text-[#B91C1C]">
              {error || 'Job not found.'}
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

  return (
    <section className="bg-[#F8FAFC] py-8 lg:py-12">
      <div className="container mx-auto px-6 lg:px-8">
        <JobDetailsBreadcrumbs category={job.category} />

        <div className="space-y-6">
          <JobDetailsSummary
            job={job}
            onSendQuote={handleSendQuote}
            sendQuoteDisabled={isAdmin}
          />
          <JobDetailsCustomer customer={job.customer} />

          <JobDetails
            job={job}
            showSummary={false}
            showTradesman={false}
          />
        </div>
      </div>
    </section>
  )
}
