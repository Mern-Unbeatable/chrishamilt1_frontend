import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import JobDetails from '@/components/data-display/JobDetails'
import { DEMO_BROWSE_JOBS, DEMO_JOB_DETAILS } from '@/data/demoData'
import JobDetailsCustomer from '@/pages/public/jobs/sections/JobDetailsCustomer'
import JobDetailsSummary from '@/pages/public/jobs/sections/JobDetailsSummary'
import {
  fetchPublicJobDetails,
  isPublicJobsApiEnabled,
} from '@/services/publicJobsApi'

function buildDemoJobDetails(job) {
  if (job.id === '1') {
    return { ...DEMO_JOB_DETAILS }
  }

  return {
    ...DEMO_JOB_DETAILS,
    id: job.id,
    title: job.title,
    location: job.location,
    price: job.priceRange,
    category: job.category,
    postedAt: job.postedAt,
  }
}

function BackLink() {
  return (
    <Link
      to="/admin/jobs"
      className="inline-flex items-center gap-1 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
    >
      <ChevronLeft className="size-4 shrink-0" strokeWidth={2} />
      Back
    </Link>
  )
}

export default function AdminJobDetailsPage() {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const useApi = isPublicJobsApiEnabled()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!useApi) {
      const match = DEMO_BROWSE_JOBS.find((item) => item.id === jobId)
      setJob(match ? buildDemoJobDetails(match) : null)
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

  if (loading) {
    return (
      <div className="space-y-4">
        <BackLink />
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
          <p className="text-sm text-[#64748B]">Loading job details…</p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="space-y-4">
        <BackLink />

        <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-6 py-12 text-center">
          <p className="text-base font-semibold text-[#B91C1C]">
            {error || 'Job not found.'}
          </p>
          <Link
            to="/admin/jobs"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-btn-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
          >
            Back to jobs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <BackLink />

      <JobDetailsSummary
        job={job}
        sendQuoteLabel="View Quote"
        onSendQuote={() => navigate(`/admin/jobs/${jobId}/quotes`)}
      />
      <JobDetailsCustomer customer={job.customer} />
      <JobDetails job={job} showSummary={false} showTradesman={false} />
    </div>
  )
}
