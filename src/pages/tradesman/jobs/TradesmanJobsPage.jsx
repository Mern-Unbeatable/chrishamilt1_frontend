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
  countActiveTradesmanJobs,
  DEMO_TRADESMAN_JOBS_LIST,
  filterTradesmanJobsByStatus,
  TRADESMAN_JOB_STATUS_OPTIONS,
  TRADESMAN_JOB_STATUS_VALUES,
} from '@/data/tradesmanJobsData'

const PAGE_SIZE = 7

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
      id: 'completed',
      label: TRADESMAN_JOB_STATUS_VALUES.COMPLETED,
      onClick: (row) => onStatusChange(row, TRADESMAN_JOB_STATUS_VALUES.COMPLETED),
    },
    {
      id: 'accepted',
      label: TRADESMAN_JOB_STATUS_VALUES.ACCEPTED,
      onClick: (row) => onStatusChange(row, TRADESMAN_JOB_STATUS_VALUES.ACCEPTED),
    },
    {
      id: 'in-progress',
      label: TRADESMAN_JOB_STATUS_VALUES.IN_PROGRESS,
      onClick: (row) => onStatusChange(row, TRADESMAN_JOB_STATUS_VALUES.IN_PROGRESS),
    },
  ]
}

export default function TradesmanJobsPage() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState(DEMO_TRADESMAN_JOBS_LIST)
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  const filteredJobs = useMemo(
    () => filterTradesmanJobsByStatus(jobs, statusFilter),
    [jobs, statusFilter],
  )

  const activeProjects = useMemo(() => countActiveTradesmanJobs(jobs), [jobs])

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE))
  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredJobs.slice(start, start + PAGE_SIZE)
  }, [filteredJobs, page])

  useEffect(() => {
    setPage(1)
  }, [statusFilter])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const handleOpenJob = useCallback(
    (row) => {
      navigate(`/tradesman/jobs/${row.id}`)
    },
    [navigate],
  )

  const handleStatusChange = useCallback((row, nextStatus) => {
    setJobs((current) =>
      current.map((job) =>
        job.id === row.id ? { ...job, status: nextStatus } : job,
      ),
    )
  }, [])

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

  const from = filteredJobs.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, filteredJobs.length)

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My jobs"
        description={`${activeProjects} active project${activeProjects === 1 ? '' : 's'}`}
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

      <DataTable
        columns={columns}
        data={paginatedJobs}
        showActions
        actions={actions}
        showPagination
        pagination={{
          page,
          pageSize: PAGE_SIZE,
          total: filteredJobs.length,
          from,
          to,
          hasPrevious: page > 1,
          hasNext: page < totalPages,
          onPageChange: setPage,
        }}
        emptyMessage="No jobs match this status filter."
        tableMinWidth="760px"
      />
    </div>
  )
}
