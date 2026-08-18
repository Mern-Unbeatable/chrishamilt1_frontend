import { useCallback, useEffect, useMemo, useState } from 'react'
import DataTable, { StatusBadge } from '@/components/data-display/DataTable/DataTable'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import { DEMO_ADMIN_CUSTOMERS } from '@/data/demoData'

const PAGE_SIZE = 7

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

function buildCustomerActions({ onSetActive, onSetSuspend, onDelete }) {
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
    {
      id: 'delete',
      label: 'Delete',
      variant: 'danger',
      onClick: onDelete,
    },
  ]
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(DEMO_ADMIN_CUSTOMERS)
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(customers.length / PAGE_SIZE))

  const paginatedCustomers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return customers.slice(start, start + PAGE_SIZE)
  }, [customers, page])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const handleSetActive = useCallback((row) => {
    setCustomers((current) =>
      current.map((customer) =>
        customer.id === row.id ? { ...customer, status: 'Active' } : customer,
      ),
    )
  }, [])

  const handleSetSuspend = useCallback((row) => {
    setCustomers((current) =>
      current.map((customer) =>
        customer.id === row.id ? { ...customer, status: 'Suspend' } : customer,
      ),
    )
  }, [])

  const handleDelete = useCallback((row) => {
    setCustomers((current) => current.filter((customer) => customer.id !== row.id))
  }, [])

  const actions = useMemo(
    () =>
      buildCustomerActions({
        onSetActive: handleSetActive,
        onSetSuspend: handleSetSuspend,
        onDelete: handleDelete,
      }),
    [handleSetActive, handleSetSuspend, handleDelete],
  )

  const from = customers.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, customers.length)

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Customers"
        description="Manage all registered customers, review their job history, and control account access."
      />

      <DataTable
        columns={CUSTOMER_COLUMNS}
        data={paginatedCustomers}
        showActions
        actions={actions}
        showPagination
        pagination={{
          page,
          pageSize: PAGE_SIZE,
          total: customers.length,
          from,
          to,
          hasPrevious: page > 1,
          hasNext: page < totalPages,
          onPageChange: setPage,
        }}
        emptyMessage="No customers found."
        tableMinWidth="1100px"
      />
    </div>
  )
}
