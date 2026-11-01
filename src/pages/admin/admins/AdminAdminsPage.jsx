import { useMemo, useState } from 'react'
import { Plus, ShieldCheck } from 'lucide-react'
import DataTable, { StatusBadge } from '@/components/data-display/DataTable/DataTable'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import AddAdminModal from '@/pages/admin/admins/sections/AddAdminModal'
import { createAdminUser, getStoredAdminUsers } from '@/services/adminAdminsApi'
import { showSuccessAlert } from '@/helpers/showAppAlert'

const PAGE_SIZE = 7

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
          <p className="font-semibold text-[#111827] truncate">{value}</p>
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

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState(() => getStoredAdminUsers())
  const [page, setPage] = useState(1)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const paginatedAdmins = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return admins.slice(start, start + PAGE_SIZE)
  }, [admins, page])

  const totalCount = admins.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const from = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, totalCount)

  const handleCreateAdmin = async (formData) => {
    try {
      const result = await createAdminUser(formData)

      if (result?.admin) {
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

        <DataTable
          columns={ADMIN_COLUMNS}
          data={paginatedAdmins}
          showPagination
          pagination={{
            page,
            pageSize: PAGE_SIZE,
            total: totalCount,
            from,
            to,
            hasPrevious: page > 1,
            hasNext: page < totalPages,
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
