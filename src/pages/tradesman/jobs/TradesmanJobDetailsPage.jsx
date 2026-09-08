import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import JobDetails from '@/components/data-display/JobDetails'
import { getTradesmanJob } from '@/data/tradesmanJobsData'
import JobDetailsCustomer from '@/pages/public/jobs/sections/JobDetailsCustomer'
import JobDetailsSummary from '@/pages/public/jobs/sections/JobDetailsSummary'
import TradesmanJobStatusActions from '@/pages/tradesman/jobs/sections/TradesmanJobStatusActions'
import {
  fetchTradesmanJobDetails,
  fetchTradesmanJobs,
  isTradesmanJobsApiEnabled,
  updateTradesmanJobStatus,
} from '@/services/tradesmanJobsApi'

function buildDemoJobDetails(tradesmanJob) {
  return {
    id: tradesmanJob.id,
    title: tradesmanJob.title || `Project for ${tradesmanJob.customerName}`,
    location: tradesmanJob.location || 'Not specified',
    price: tradesmanJob.price,
    status: tradesmanJob.status,
    statusVariant:
      tradesmanJob.status.toLowerCase() === 'completed'
        ? 'completed'
        : tradesmanJob.status.toLowerCase() === 'accepted'
          ? 'open'
          : 'inProgress',
    customer: {
      id: tradesmanJob.customerId ?? null,
      name: tradesmanJob.customerName,
      phone: tradesmanJob.phoneNumber,
    },
    description: { summary: 'Assigned job details.', full: 'Assigned job details.' },
    requirements: [],
    preferredStart: 'Not specified',
    completionBy: 'Not specified',
    specialNotes: '',
    photos: [],
  }
}

export default function TradesmanJobDetailsPage() {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const useApi = isTradesmanJobsApiEnabled()

  const demoJob = getTradesmanJob(jobId)
  const [job, setJob] = useState(useApi ? null : demoJob ? buildDemoJobDetails(demoJob) : null)
  const [assignmentStatus, setAssignmentStatus] = useState(demoJob?.status ?? '')
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    if (!useApi) {
      const nextDemoJob = getTradesmanJob(jobId)
      setJob(nextDemoJob ? buildDemoJobDetails(nextDemoJob) : null)
      setLoading(false)
      setError('')
      return undefined
    }

    let cancelled = false

    async function loadJob() {
      setLoading(true)
      setError('')

      try {
        const [data, assignments] = await Promise.all([
          fetchTradesmanJobDetails(jobId),
          fetchTradesmanJobs({ page: 1, limit: 50, statusFilter: 'all' }),
        ])
        if (!cancelled) {
          setJob(data)
          const assignment = assignments.jobs.find((item) => item.id === jobId)
          setAssignmentStatus(assignment?.status ?? data.status ?? '')
        }
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
  }, [jobId, useApi])

  const handleStatusChange = async (nextStatus) => {
    if (!useApi) {
      setAssignmentStatus(nextStatus)
      setJob((current) => ({ ...current, status: nextStatus }))
      return
    }

    setUpdatingStatus(true)
    setError('')

    try {
      const updated = await updateTradesmanJobStatus(jobId, nextStatus)
      setAssignmentStatus(updated.status)
      setJob((current) => ({ ...current, status: updated.status }))
    } catch (err) {
      setError(err?.message || 'Unable to update job status.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Link
          to="/tradesman/jobs"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
        >
          <ChevronLeft className="size-4 shrink-0" strokeWidth={2} />
          Back
        </Link>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-12 text-center">
          <p className="text-sm text-[#64748B]">Loading job details…</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="space-y-6">
        <Link
          to="/tradesman/jobs"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
        >
          <ChevronLeft className="size-4 shrink-0" strokeWidth={2} />
          Back
        </Link>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-12 text-center">
          <p className="text-base font-semibold text-[#111827]">Job not found</p>
          <p className="mt-2 text-sm text-[#64748B]">
            {error || 'This job may have been removed or is no longer assigned to you.'}
          </p>
          <Link
            to="/tradesman/jobs"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-btn-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
          >
            Back to my jobs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link
        to="/tradesman/jobs"
        className="inline-flex items-center gap-1 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
      >
        <ChevronLeft className="size-4 shrink-0" strokeWidth={2} />
        Back
      </Link>

      <JobDetailsSummary job={job} />
      <JobDetailsCustomer customer={job.customer} />

      {useApi ? (
        <TradesmanJobStatusActions
          status={assignmentStatus || job.status}
          onStatusChange={handleStatusChange}
          updating={updatingStatus}
        />
      ) : null}

      <JobDetails
        job={job}
        showSummary={false}
        showTradesman={false}
        onMessage={() =>
          navigate('/tradesman/messages', {
            state: {
              customerId: job.customer?.id ?? null,
              jobId: job.id ?? null,
            },
          })
        }
      />
    </div>
  )
}
