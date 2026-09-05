import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import DataTable, { StatusBadge } from '@/components/data-display/DataTable/DataTable'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import { DEMO_ADMIN_TRADESMEN } from '@/data/demoData'
import { submitAdminUserStatus } from '@/helpers/submitAdminUserStatus'
import {
  ADMIN_TRADESMEN_PAGE_SIZE,
  fetchAdminTradesmen,
  isAdminTradesmenApiEnabled,
} from '@/services/adminTradesmenApi'
import { ADMIN_USER_STATUS } from '@/services/adminUsersApi'

const DEMO_PAGE_SIZE = 7

const TRADESMAN_COLUMNS = [
  { key: 'tradesmanName', header: 'Tradesman Name' },
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
  {
    key: 'status',
    header: 'Status',
    render: (value) => <StatusBadge status={value} />,
  },
]

function buildTradesmanActions({ onSeeDetails, onSetActive, onSetSuspend }) {
  return [
    {
      id: 'details',
      label: 'See Details',
      variant: 'header',
      onClick: onSeeDetails,
    },
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

export default function AdminTradesmenPage() {
  const navigate = useNavigate()
  const useApi = isAdminTradesmenApiEnabled()
  const pageSize = useApi ? ADMIN_TRADESMEN_PAGE_SIZE : DEMO_PAGE_SIZE

  const [tradesmen, setTradesmen] = useState(useApi ? [] : DEMO_ADMIN_TRADESMEN)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(useApi ? 0 : DEMO_ADMIN_TRADESMEN.length)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState('')

  const demoPaginatedTradesmen = useMemo(() => {
    const start = (page - 1) * pageSize
    return tradesmen.slice(start, start + pageSize)
  }, [tradesmen, page, pageSize])

  useEffect(() => {
    if (!useApi) return undefined

    let cancelled = false

    async function loadTradesmen() {
      setLoading(true)
      setError('')

      try {
        const result = await fetchAdminTradesmen({ page, limit: pageSize })

        if (cancelled) return

        setTradesmen(result.tradesmen)
        setTotalCount(result.pagination.total ?? result.tradesmen.length)
        setTotalPages(Math.max(1, result.pagination.totalPages ?? 1))
      } catch (err) {
        if (cancelled) return

        setTradesmen([])
        setTotalCount(0)
        setTotalPages(1)
        setError(err?.message || 'Unable to load tradesmen.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadTradesmen()

    return () => {
      cancelled = true
    }
  }, [useApi, page, pageSize])

  useEffect(() => {
    if (useApi) return
    const nextTotalPages = Math.max(1, Math.ceil(tradesmen.length / pageSize))
    if (page > nextTotalPages) setPage(nextTotalPages)
  }, [useApi, tradesmen.length, page, pageSize])

  const displayTradesmen = useApi ? tradesmen : demoPaginatedTradesmen
  const displayTotalCount = useApi ? totalCount : tradesmen.length
  const displayTotalPages = useApi
    ? totalPages
    : Math.max(1, Math.ceil(tradesmen.length / pageSize))

  const handleSeeDetails = useCallback(
    (row) => {
      navigate(`/admin/tradesmen/${row.id}`)
    },
    [navigate],
  )

  const handleSetActive = useCallback(
    async (row) => {
      if (!useApi) {
        setTradesmen((current) =>
          current.map((tradesman) =>
            tradesman.id === row.id ? { ...tradesman, status: 'Active' } : tradesman,
          ),
        )
        return
      }

      if (updatingId) return

      setUpdatingId(row.id)

      try {
        const displayStatus = await submitAdminUserStatus(row.id, ADMIN_USER_STATUS.ACTIVE, {
          successText: 'Tradesman account is now active.',
        })

        if (displayStatus) {
          setTradesmen((current) =>
            current.map((tradesman) =>
              tradesman.id === row.id ? { ...tradesman, status: displayStatus } : tradesman,
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
        setTradesmen((current) =>
          current.map((tradesman) =>
            tradesman.id === row.id ? { ...tradesman, status: 'Suspend' } : tradesman,
          ),
        )
        return
      }

      if (updatingId) return

      setUpdatingId(row.id)

      try {
        const displayStatus = await submitAdminUserStatus(row.id, ADMIN_USER_STATUS.SUSPENDED, {
          successText: 'Tradesman account has been suspended.',
        })

        if (displayStatus) {
          setTradesmen((current) =>
            current.map((tradesman) =>
              tradesman.id === row.id ? { ...tradesman, status: displayStatus } : tradesman,
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
  //   setTradesmen((current) => current.filter((tradesman) => tradesman.id !== row.id))
  // }, [])

  const actions = useMemo(
    () =>
      buildTradesmanActions({
        onSeeDetails: handleSeeDetails,
        onSetActive: handleSetActive,
        onSetSuspend: handleSetSuspend,
      }),
    [handleSeeDetails, handleSetActive, handleSetSuspend],
  )

  const from = displayTotalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, displayTotalCount)

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Tradesmen"
        description="Monitor every tradesman on the platform — their token balance, quote activity, and account standing."
      />

      {error ? (
        <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
          {error}
        </p>
      ) : null}

      <DataTable
        columns={TRADESMAN_COLUMNS}
        data={displayTradesmen}
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
        emptyMessage="No tradesmen found."
        tableMinWidth="960px"
      />
    </div>
  )
}
