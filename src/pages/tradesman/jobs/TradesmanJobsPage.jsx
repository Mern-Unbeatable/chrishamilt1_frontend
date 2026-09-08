import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronDown, Filter } from 'lucide-react'
import { useNavigate } from 'react-router'
import DataTable, { StatusBadge } from '@/components/data-display/DataTable/DataTable'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@/components/Dropdown'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import {
  TRADESMAN_JOB_STATUS_OPTIONS,
  TRADESMAN_JOB_STATUS_VALUES,
} from '@/data/tradesmanJobsData'
import {
  fetchTradesmanActiveJobsCount,
  fetchTradesmanJobs,
  getDemoTradesmanJobsPage,
  isTradesmanJobsApiEnabled,
  TRADESMAN_JOBS_PAGE_SIZE,
  updateTradesmanJobStatus,
} from '@/services/tradesmanJobsApi'

const PAGE_SIZE = TRADESMAN_JOBS_PAGE_SIZE

const TRADESMAN_JOB_COLUMNS = [
  {
    key: 'jobId',
    header: 'Job ID',
    headerClassName: 'text-xs uppercase tracking-wide text-[var(--secondary-text)]',
  },
  {
    key: 'customerName',
    header: 'Customer name',
    headerClassName: 'text-xs uppercase tracking-wide text-[var(--secondary-text)]',
  },
  {
    key: 'phoneNumber',
    header: 'Phone number',
    headerClassName: 'text-xs uppercase tracking-wide text-[var(--secondary-text)]',
  },
  {
    key: 'price',
    header: 'Price',
    headerClassName: 'text-xs uppercase tracking-wide text-[var(--secondary-text)]',
  },
  {
    key: 'status',
    header: 'Status',
    headerClassName: 'text-xs uppercase tracking-wide text-[var(--secondary-text)]',
    render: (value) => <StatusBadge status={value} />,
  },
]

function buildJobColumns(onOpenJob) {
  return TRADESMAN_JOB_COLUMNS.map((column) => {
    if (column.key !== 'jobId') return column

    return {
      ...column,
      render: (value, row) => (
        <button
          type="button"
          onClick={() => onOpenJob(row)}
          className="font-semibold text-btn-primary transition-colors hover:text-[#0150CC]"
        >
          {value}
        </button>
      ),
    }
  })
}

function buildJobActions({ onSeeDetails, onStatusChange }) {
  return [
    {
      id: 'details',
      label: 'See Details',
      variant: 'header',
      onClick: onSeeDetails,
    },
    {
      id: 'status-section',
      label: 'Status',
      variant: 'section',
    },
    {
      id: 'in-progress',
      label: TRADESMAN_JOB_STATUS_VALUES.IN_PROGRESS,
      onClick: (row) => onStatusChange(row, TRADESMAN_JOB_STATUS_VALUES.IN_PROGRESS),
    },
    {
      id: 'completed',
      label: TRADESMAN_JOB_STATUS_VALUES.COMPLETED,
      onClick: (row) => onStatusChange(row, TRADESMAN_JOB_STATUS_VALUES.COMPLETED),
    },
  ]
}

export default function TradesmanJobsPage() {
  const navigate = useNavigate()
  const useApi = isTradesmanJobsApiEnabled()

  const [jobs, setJobs] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [activeProjects, setActiveProjects] = useState(0)
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')

  const demoResult = useMemo(
    () => getDemoTradesmanJobsPage(page, PAGE_SIZE, statusFilter),
    [page, statusFilter],
  )

  useEffect(() => {
    if (!useApi) {
      setJobs(demoResult.jobs)
      setTotal(demoResult.pagination.total)
      setTotalPages(demoResult.pagination.totalPages)
      setActiveProjects(demoResult.activeProjects)
      setLoading(false)
      setError('')
      return undefined
    }

    let cancelled = false

    async function loadJobs() {
      setLoading(true)
      setError('')

      try {
        const [result, activeCount] = await Promise.all([
          fetchTradesmanJobs({ page, limit: PAGE_SIZE, statusFilter }),
          fetchTradesmanActiveJobsCount(),
        ])

        if (cancelled) return

        setJobs(result.jobs)
        setTotal(result.pagination.total)
        setTotalPages(result.pagination.totalPages)
        setActiveProjects(activeCount)
      } catch (err) {
        if (cancelled) return

        setJobs([])
        setTotal(0)
        setTotalPages(1)
        setError(err?.message || 'Unable to load your jobs right now.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadJobs()

    return () => {
      cancelled = true
    }
  }, [page, statusFilter, useApi])

  useEffect(() => {
    setPage(1)
  }, [statusFilter])

  const handleOpenJob = useCallback(
    (row) => {
      navigate(`/tradesman/jobs/${row.id}`)
    },
    [navigate],
  )

  const handleStatusChange = useCallback(
    async (row, nextStatus) => {
      if (!useApi) {
        setJobs((current) =>
          current.map((job) =>
            job.id === row.id ? { ...job, status: nextStatus } : job,
          ),
        )
        return
      }

      setError('')

      try {
        const updated = await updateTradesmanJobStatus(row.id, nextStatus)
        setJobs((current) =>
          current.map((job) => (job.id === row.id ? { ...job, ...updated } : job)),
        )
      } catch (err) {
        setError(err?.message || 'Unable to update job status.')
      }
    },
    [useApi],
  )

  const columns = useMemo(() => buildJobColumns(handleOpenJob), [handleOpenJob])
  const actions = useMemo(
    () =>
      buildJobActions({
        onSeeDetails: handleOpenJob,
        onStatusChange: handleStatusChange,
      }),
    [handleOpenJob, handleStatusChange],
  )

  const selectedFilterLabel =
    TRADESMAN_JOB_STATUS_OPTIONS.find((option) => option.value === statusFilter)?.label ||
    'All Status'

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, total)

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My jobs"
        description={
          loading
            ? 'Loading jobs…'
            : `${activeProjects} active project${activeProjects === 1 ? '' : 's'}`
        }
        actions={
          <Dropdown className="w-full sm:w-auto sm:min-w-[180px]">
            <DropdownTrigger className="h-10 w-full justify-between gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm font-semibold text-[#111827] shadow-none transition-colors hover:bg-[#F8FAFC]">
              <span className="inline-flex items-center gap-2 truncate">
                <Filter className="size-4 shrink-0 text-[#64748B]" strokeWidth={2} />
                {selectedFilterLabel}
              </span>
              <ChevronDown className="size-4 shrink-0 text-[#94A3B8]" strokeWidth={2} />
            </DropdownTrigger>
            <DropdownMenu align="right" className="min-w-[180px]">
              {TRADESMAN_JOB_STATUS_OPTIONS.map((option) => (
                <DropdownItem key={option.value} onClick={() => setStatusFilter(option.value)}>
                  {option.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        }
      />

      {error ? (
        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-6 py-4">
          <p className="text-sm font-semibold text-[#B91C1C]">{error}</p>
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
          <p className="text-sm text-[#64748B]">Loading jobs…</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={jobs}
          showActions
          actions={actions}
          showPagination
          pagination={{
            page,
            pageSize: PAGE_SIZE,
            total,
            from,
            to,
            hasPrevious: page > 1,
            hasNext: page < totalPages,
            onPageChange: setPage,
          }}
          emptyMessage="No jobs match this status filter."
          tableMinWidth="760px"
        />
      )}
    </div>
  )
}
