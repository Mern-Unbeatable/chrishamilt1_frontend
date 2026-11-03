import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, ShieldCheck, Trash2 } from 'lucide-react'
import DataTable, { StatusBadge } from '@/components/data-display/DataTable/DataTable'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import AddAdminModal from '@/pages/admin/admins/sections/AddAdminModal'
import { useAuth } from '@/auth/AuthProvider'
import {
  ADMIN_ADMINS_PAGE_SIZE,
  createAdminUser,
  deleteStoredAdminUser,
  fetchAdminUsers,
  getStoredAdminUsers,
  isAdminUsersApiEnabled,
} from '@/services/adminAdminsApi'
import { submitAdminUserDelete } from '@/helpers/submitAdminUserDelete'
import { showErrorAlert, showSuccessAlert } from '@/helpers/showAppAlert'

const DEMO_PAGE_SIZE = 7

const ADMIN_COLUMNS = [
  {
    key: 'fullName',
    header: 'Admin Name',
    render: (value, row) => (
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-btn-primary">
          {value ? value.slice(0, 2).toUpperCase() : 'AD'}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-[#111827] truncate">{value}</p>
            {row.isPrimaryAdmin ? (
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                Primary
              </span>
            ) : null}
          </div>
          <span className="text-xs text-[#64748B]">ID: {row.id}</span>
        </div>
      </div>
    ),
  },
  { key: 'email', header: 'Email' },
  { key: 'phoneNumber', header: 'Phone Number' },
  {
    key: 'address',
    header: 'Address',
    wrap: false,
    className: 'max-w-[200px]',
    render: (value) => {
      const firstLine = String(value || '')
        .split('\n')[0]
        .trim()
      return (
        <span
          className="block truncate text-sm leading-5 text-[#475569]"
          title={value}
        >
          {firstLine || '—'}
        </span>
      )
    },
  },
  {
    key: 'role',
    header: 'Role',
    render: () => (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-btn-primary">
        <ShieldCheck className="size-3.5" />
        Admin
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (value) => <StatusBadge status={value || 'Active'} />,
  },
  { key: 'joinedDate', header: 'Joined Date' },
]

function isProtectedAdmin(row = {}, currentUserId) {
  const isPrimary =
    Boolean(row.isPrimaryAdmin) ||
    row.email?.toLowerCase() === 'admin@tradersinloop.co.uk'
  const isSelf = currentUserId && String(row.id) === String(currentUserId)
  return isPrimary || isSelf
}

function buildAdminActions({ onDelete, currentUserId }) {
  return [
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="size-4 text-red-600" />,
      variant: 'danger',
      disabled: (row) => isProtectedAdmin(row, currentUserId),
      onClick: onDelete,
    },
  ]
}

export default function AdminAdminsPage() {
  const { session } = useAuth()
  const currentUserId = session?.user?.id
  const useApi = isAdminUsersApiEnabled()
  const pageSize = useApi ? ADMIN_ADMINS_PAGE_SIZE : DEMO_PAGE_SIZE

  const [admins, setAdmins] = useState(useApi ? [] : () => getStoredAdminUsers())
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const loadAdmins = useCallback(async () => {
    if (!useApi) return

    setLoading(true)
    setError('')

    try {
      const result = await fetchAdminUsers({ page, limit: pageSize })
      setAdmins(result.admins)
      setTotalCount(result.pagination.total ?? result.admins.length)
      setTotalPages(Math.max(1, result.pagination.totalPages ?? 1))
    } catch (err) {
      setAdmins([])
      setTotalCount(0)
      setTotalPages(1)
      setError(err?.message || 'Unable to load administrators.')
    } finally {
      setLoading(false)
    }
  }, [useApi, page, pageSize])

  useEffect(() => {
    loadAdmins()
  }, [loadAdmins])

  const demoPaginatedAdmins = useMemo(() => {
    if (useApi) return admins
    const start = (page - 1) * pageSize
    return admins.slice(start, start + pageSize)
  }, [useApi, admins, page, pageSize])

  const displayAdmins = useApi ? admins : demoPaginatedAdmins
  const displayTotalCount = useApi ? totalCount : admins.length
  const displayTotalPages = useApi
    ? totalPages
    : Math.max(1, Math.ceil(admins.length / pageSize))

  const from = displayTotalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, displayTotalCount)

  const handleDelete = useCallback(
    async (row) => {
      if (row.isPrimaryAdmin || row.email?.toLowerCase() === 'admin@tradersinloop.co.uk') {
        await showErrorAlert({
          title: 'Action Not Allowed',
          text: 'The primary admin account cannot be deleted.',
        })
        return
      }

      if (currentUserId && String(row.id) === String(currentUserId)) {
        await showErrorAlert({
          title: 'Action Not Allowed',
          text: 'You cannot delete your own logged-in admin account.',
        })
        return
      }

      const success = await submitAdminUserDelete(row.id, row.fullName, {
        userType: 'Admin',
      })

      if (success) {
        if (useApi) {
          loadAdmins()
        } else {
          deleteStoredAdminUser(row.id)
          setAdmins((current) => current.filter((admin) => admin.id !== row.id))
          setTotalCount((current) => Math.max(0, current - 1))
        }
      }
    },
    [currentUserId, useApi, loadAdmins],
  )

  const actions = useMemo(
    () =>
      buildAdminActions({
        onDelete: handleDelete,
        currentUserId,
      }),
    [handleDelete, currentUserId],
  )

  const handleCreateAdmin = async (formData) => {
    try {
      const result = await createAdminUser(formData)

      if (useApi) {
        await loadAdmins()
      } else if (result?.admin) {
        setAdmins((current) => [result.admin, ...current])
      }

      await showSuccessAlert({
        title: 'Admin Created',
        text: `Admin account for ${formData.fullName} has been created successfully.`,
      })

      return { ok: true }
    } catch (err) {
      return {
        ok: false,
        error: err?.message || 'Unable to register admin account.',
      }
    }
  }

  return (
    <>
      <div className="space-y-6">
        <DashboardPageHeader
          title="Admins"
          description="Manage all system administrators, assign roles, and create new admin accounts."
          actions={
            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-btn-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
            >
              <Plus className="size-4" strokeWidth={2.25} />
              Add Admin
            </button>
          }
        />

        {error ? (
          <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
            {error}
          </p>
        ) : null}

        <DataTable
          columns={ADMIN_COLUMNS}
          data={displayAdmins}
          showActions
          actions={actions}
          loading={useApi && loading}
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
          emptyMessage="No admins found."
          tableMinWidth="1000px"
        />
      </div>

      <AddAdminModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateAdmin}
      />
    </>
  )
}
