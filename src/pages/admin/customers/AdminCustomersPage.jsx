import { useCallback, useEffect, useMemo, useState } from 'react'
import DataTable, { StatusBadge } from '@/components/data-display/DataTable/DataTable'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import { DEMO_ADMIN_CUSTOMERS } from '@/data/demoData'
import { submitAdminUserStatus } from '@/helpers/submitAdminUserStatus'
import {
  ADMIN_CUSTOMERS_PAGE_SIZE,
  fetchAdminCustomers,
  isAdminCustomersApiEnabled,
} from '@/services/adminCustomersApi'
import { ADMIN_USER_STATUS } from '@/services/adminUsersApi'

const DEMO_PAGE_SIZE = 7

const CUSTOMER_COLUMNS = [
  { key: 'userName', header: 'User Name' },
  { key: 'email', header: 'Email' },
  { key: 'phoneNumber', header: 'Phone Number' },
  {
    key: 'location',
    header: 'Location',
    wrap: true,
    className: 'max-w-[220px]',
    render: (value) => (
      <span className="whitespace-pre-line text-sm leading-5">{value}</span>
    ),
  },
  { key: 'jobsPosted', header: 'Jobs Posted' },
  {
    key: 'status',
    header: 'Status',
    render: (value) => <StatusBadge status={value} />,
  },
  { key: 'joinedDate', header: 'Joined Date' },
]

function buildCustomerActions({ onSetActive, onSetSuspend }) {
  return [
    {
      id: 'active',
      label: 'Active',
      onClick: onSetActive,
    },
    {
      id: 'suspend',
      label: 'Suspend',
      onClick: onSetSuspend,
    },
    // {
    //   id: 'delete',
    //   label: 'Delete',
    //   variant: 'danger',
    //   onClick: onDelete,
    // },
  ]
}

export default function AdminCustomersPage() {
  const useApi = isAdminCustomersApiEnabled()
  const pageSize = useApi ? ADMIN_CUSTOMERS_PAGE_SIZE : DEMO_PAGE_SIZE

  const [customers, setCustomers] = useState(useApi ? [] : DEMO_ADMIN_CUSTOMERS)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(useApi ? 0 : DEMO_ADMIN_CUSTOMERS.length)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState('')

  const demoPaginatedCustomers = useMemo(() => {
    const start = (page - 1) * pageSize
    return customers.slice(start, start + pageSize)
  }, [customers, page, pageSize])

  useEffect(() => {
    if (!useApi) return undefined

    let cancelled = false

    async function loadCustomers() {
      setLoading(true)
      setError('')

      try {
        const result = await fetchAdminCustomers({ page, limit: pageSize })

        if (cancelled) return

        setCustomers(result.customers)
        setTotalCount(result.pagination.total ?? result.customers.length)
        setTotalPages(Math.max(1, result.pagination.totalPages ?? 1))
      } catch (err) {
        if (cancelled) return

        setCustomers([])
        setTotalCount(0)
        setTotalPages(1)
        setError(err?.message || 'Unable to load customers.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadCustomers()

    return () => {
      cancelled = true
    }
  }, [useApi, page, pageSize])

  useEffect(() => {
    if (useApi) return
    const nextTotalPages = Math.max(1, Math.ceil(customers.length / pageSize))
    if (page > nextTotalPages) setPage(nextTotalPages)
  }, [useApi, customers.length, page, pageSize])

  const displayCustomers = useApi ? customers : demoPaginatedCustomers
  const displayTotalCount = useApi ? totalCount : customers.length
  const displayTotalPages = useApi
    ? totalPages
    : Math.max(1, Math.ceil(customers.length / pageSize))

  const handleSetActive = useCallback(
    async (row) => {
      if (!useApi) {
        setCustomers((current) =>
          current.map((customer) =>
            customer.id === row.id ? { ...customer, status: 'Active' } : customer,
          ),
        )
        return
      }

      if (updatingId) return

      setUpdatingId(row.id)

      try {
        const displayStatus = await submitAdminUserStatus(row.id, ADMIN_USER_STATUS.ACTIVE, {
          successText: 'Customer account is now active.',
        })

        if (displayStatus) {
          setCustomers((current) =>
            current.map((customer) =>
              customer.id === row.id ? { ...customer, status: displayStatus } : customer,
            ),
          )
        }
      } finally {
        setUpdatingId('')
      }
    },
    [useApi, updatingId],
  )

  const handleSetSuspend = useCallback(
    async (row) => {
      if (!useApi) {
        setCustomers((current) =>
          current.map((customer) =>
            customer.id === row.id ? { ...customer, status: 'Suspend' } : customer,
          ),
        )
        return
      }

      if (updatingId) return

      setUpdatingId(row.id)

      try {
        const displayStatus = await submitAdminUserStatus(row.id, ADMIN_USER_STATUS.SUSPENDED, {
          successText: 'Customer account has been suspended.',
        })

        if (displayStatus) {
          setCustomers((current) =>
            current.map((customer) =>
              customer.id === row.id ? { ...customer, status: displayStatus } : customer,
            ),
          )
        }
      } finally {
        setUpdatingId('')
      }
    },
    [useApi, updatingId],
  )

  // const handleDelete = useCallback((row) => {
  //   setCustomers((current) => current.filter((customer) => customer.id !== row.id))
  // }, [])

  const actions = useMemo(
    () =>
      buildCustomerActions({
        onSetActive: handleSetActive,
        onSetSuspend: handleSetSuspend,
      }),
    [handleSetActive, handleSetSuspend],
  )

  const from = displayTotalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, displayTotalCount)

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Customers"
        description="Manage all registered customers, review their job history, and control account access."
      />

      {error ? (
        <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
          {error}
        </p>
      ) : null}

      <DataTable
        columns={CUSTOMER_COLUMNS}
        data={displayCustomers}
        loading={useApi && loading}
        showActions
        actions={actions}
        showPagination
        pagination={{
          page,
          pageSize,
          total: displayTotalCount,
          from,
          to,
          hasPrevious: page > 1,
          hasNext: page < displayTotalPages,
          onPageChange: setPage,
        }}
        emptyMessage="No customers found."
        tableMinWidth="1100px"
      />
    </div>
  )
}
