import { useMemo, useState } from 'react'
import JobDetails from '@/components/data-display/JobDetails'
import JobCard from '@/components/data-display/JobCard/JobCard'
import DataTable, { StatusBadge } from '@/components/data-display/DataTable/DataTable'
import QuoteCard from '@/components/data-display/QuoteCard/QuoteCard'
import TokenPricingCard from '@/components/data-display/TokenPricingCard/TokenPricingCard'
import WalletStatCard from '@/components/data-display/WalletStatCard/WalletStatCard'
import ProfileSettings from '@/components/forms/ProfileSettings/ProfileSettings'
import Pagination from '@/components/common/Pagination/Pagination'
import Messenger from '@/components/common/messenger/Messenger'
import useMessages from '@/components/common/messenger/useMessages'
import {
  DEMO_ADMIN_CUSTOMERS,
  DEMO_ADMIN_PROFILE,
  DEMO_CUSTOMER_QUOTES,
  DEMO_JOB_DETAILS,
  DEMO_QUOTES,
  DEMO_RECENT_JOBS,
  DEMO_TABLE_MENU_ACTIONS,
  DEMO_TOKEN_PRICING,
  DEMO_TRADESMAN_JOBS,
  DEMO_TRADESMAN_PROFILE,
  DEMO_USER_PROFILE,
  DEMO_WALLET_STATS,
} from '@/data/demoData'

function PreviewFrame({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-full ${className}`}>{children}</div>
  )
}

function JobDetailsPreview() {
  return (
    <PreviewFrame>
      <JobDetails
        job={DEMO_JOB_DETAILS}
        onMessage={() => {}}
      />
    </PreviewFrame>
  )
}

function JobCardPreview() {
  const job = DEMO_RECENT_JOBS[0]

  return (
    <PreviewFrame className="space-y-4">
      <JobCard {...job} onViewLead={() => {}} />
    </PreviewFrame>
  )
}

function QuoteCardPreview() {
  const quote = DEMO_QUOTES[0]
  const customerQuote = DEMO_CUSTOMER_QUOTES[0]

  return (
    <PreviewFrame className="space-y-8">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--secondary-text)]">
          Tradesman dashboard
        </p>
        <QuoteCard
          {...quote}
          onViewDetails={() => {}}
          onEditQuote={() => {}}
          onWithdraw={() => {}}
          onMessageCustomer={() => {}}
        />
      </div>
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--secondary-text)]">
          Customer dashboard
        </p>
        <QuoteCard
          variant="customer"
          {...customerQuote}
          onHireTradesman={() => {}}
          onViewDetails={() => {}}
          onMessage={() => {}}
        />
      </div>
    </PreviewFrame>
  )
}

function WalletStatCardPreview() {
  return (
    <PreviewFrame>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_WALLET_STATS.map((stat) => (
          <WalletStatCard key={stat.id} {...stat} />
        ))}
      </div>
    </PreviewFrame>
  )
}

function TokenPricingCardPreview() {
  return (
    <PreviewFrame>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {DEMO_TOKEN_PRICING.map((plan) => (
          <TokenPricingCard
            key={plan.id}
            {...plan}
            onBuyTokens={() => {}}
          />
        ))}
      </div>
    </PreviewFrame>
  )
}

function ProfileSettingsPreview() {
  return (
    <PreviewFrame className="space-y-10">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--secondary-text)]">
          User dashboard
        </p>
        <ProfileSettings
          role="user"
          defaultValue={DEMO_USER_PROFILE}
          onUpdateProfile={() => {}}
          onChangePassword={() => {}}
          onUploadAvatar={() => {}}
        />
      </div>
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--secondary-text)]">
          Tradesman dashboard
        </p>
        <ProfileSettings
          role="tradesman"
          defaultValue={DEMO_TRADESMAN_PROFILE}
          onUpdateProfile={() => {}}
          onSaveWarehouses={() => {}}
          onChangePassword={() => {}}
        />
      </div>
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--secondary-text)]">
          Admin dashboard
        </p>
        <ProfileSettings
          role="admin"
          defaultValue={DEMO_ADMIN_PROFILE}
          onUpdateProfile={() => {}}
          onChangePassword={() => {}}
        />
      </div>
    </PreviewFrame>
  )
}

function MessengerPreview() {
  const state = useMessages()

  return (
    <PreviewFrame className="h-[min(680px,calc(100dvh-8rem))] min-h-[520px] p-4 sm:p-6">
      <Messenger {...state} placeholder="Write a message..." className="h-full min-h-0" />
    </PreviewFrame>
  )
}

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

const ADMIN_CUSTOMER_COLUMNS = [
  { key: 'userName', header: 'User name' },
  { key: 'email', header: 'Email' },
  { key: 'phoneNumber', header: 'Phone number' },
  {
    key: 'location',
    header: 'Location',
    wrap: true,
    className: 'max-w-[220px]',
    render: (value) => (
      <span className="whitespace-pre-line text-sm leading-5">{value}</span>
    ),
  },
  { key: 'jobsPosted', header: 'Jobs posted' },
  {
    key: 'status',
    header: 'Status',
    render: (value) => <StatusBadge status={value} />,
  },
  { key: 'joinedDate', header: 'Joined date' },
]

function DataTablePreview() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 5

  const filteredJobs = useMemo(() => {
    if (statusFilter === 'all') return DEMO_TRADESMAN_JOBS
    return DEMO_TRADESMAN_JOBS.filter(
      (row) => row.status.toLowerCase() === statusFilter.toLowerCase(),
    )
  }, [statusFilter])

  const filteredCustomers = useMemo(() => DEMO_ADMIN_CUSTOMERS, [])
  const pagedCustomers = filteredCustomers.slice(
    (page - 1) * pageSize,
    page * pageSize,
  )

  return (
    <PreviewFrame className="space-y-10">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--secondary-text)]">
          Tradesman — My jobs
        </p>
        <DataTable
          showFilters
          filterLabel=""
          filters={[
            {
              id: 'status',
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: 'all', label: 'All status' },
                { value: 'completed', label: 'Completed' },
                { value: 'accepted', label: 'Accepted' },
                { value: 'in progress', label: 'In progress' },
              ],
            },
          ]}
          columns={TRADESMAN_JOB_COLUMNS}
          data={filteredJobs}
          showActions
          actions={DEMO_TABLE_MENU_ACTIONS}
          tableMinWidth="760px"
        />
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--secondary-text)]">
          Admin — Customers
        </p>
        <DataTable
          columns={ADMIN_CUSTOMER_COLUMNS}
          data={pagedCustomers}
          showActions
          actions={DEMO_TABLE_MENU_ACTIONS}
          showPagination
          pagination={{
            page,
            pageSize,
            total: filteredCustomers.length,
            onPageChange: setPage,
          }}
          tableMinWidth="1100px"
        />
      </div>
    </PreviewFrame>
  )
}

function PaginationPreview() {
  const [page, setPage] = useState(2)

  return (
    <PreviewFrame className="space-y-4">
      <p className="text-sm text-[var(--secondary-text)]">
        Standalone numbered pagination for card grids and non-table layouts.
      </p>
      <Pagination page={page} totalPages={8} onPageChange={setPage} />
    </PreviewFrame>
  )
}

export default function ComponentPreview({ previewId }) {
  switch (previewId) {
    case 'job-details':
      return <JobDetailsPreview />
    case 'job-card':
      return <JobCardPreview />
    case 'quote-card':
      return <QuoteCardPreview />
    case 'wallet-stat-card':
      return <WalletStatCardPreview />
    case 'token-pricing-card':
      return <TokenPricingCardPreview />
    case 'profile-settings':
      return <ProfileSettingsPreview />
    case 'data-table':
      return <DataTablePreview />
    case 'pagination':
      return <PaginationPreview />
    case 'messenger':
      return <MessengerPreview />
    default:
      return (
        <p className="text-sm text-[var(--secondary-text)]">
          No preview registered for &quot;{previewId}&quot;.
        </p>
      )
  }
}
