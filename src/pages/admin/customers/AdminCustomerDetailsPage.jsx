import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { StatusBadge } from '@/components/data-display/DataTable/DataTable'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import { DEMO_ADMIN_CUSTOMERS } from '@/data/demoData'
import { submitAdminUserStatus } from '@/helpers/submitAdminUserStatus'
import {
  fetchAdminCustomer,
  isAdminCustomersApiEnabled,
} from '@/services/adminCustomersApi'
import { ADMIN_USER_STATUS } from '@/services/adminUsersApi'

function getDemoCustomerDetail(customerId) {
  const row = DEMO_ADMIN_CUSTOMERS.find((item) => item.id === customerId)
  if (!row) return null

  return {
    ...row,
    avatar: null,
    bookingsCount: 0,
    completedJobs: 0,
    cancelledJobs: 0,
    recentJobs: [],
  }
}

export default function AdminCustomerDetailsPage() {
  const { customerId } = useParams()
  const useApi = isAdminCustomersApiEnabled()

  const [customer, setCustomer] = useState(useApi ? null : getDemoCustomerDetail(customerId))
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!useApi) {
      setCustomer(getDemoCustomerDetail(customerId))
      setLoading(false)
      setError('')
      return undefined
    }

    let cancelled = false

    async function loadDetail() {
      setLoading(true)
      setError('')

      try {
        const data = await fetchAdminCustomer(customerId)
        if (!cancelled) setCustomer(data)
      } catch (err) {
        if (!cancelled) {
          setCustomer(null)
          setError(err?.message || 'Unable to load customer details.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDetail()

    return () => {
      cancelled = true
    }
  }, [customerId, useApi])

  const handleSetActive = async () => {
    if (!customer || updating) return

    if (!useApi) {
      setCustomer((current) => (current ? { ...current, status: 'Active' } : current))
      return
    }

    setUpdating(true)
    try {
      const displayStatus = await submitAdminUserStatus(customer.id, ADMIN_USER_STATUS.ACTIVE, {
        successText: 'Customer account is now active.',
      })
      if (displayStatus) {
        setCustomer((current) => (current ? { ...current, status: displayStatus } : current))
      }
    } finally {
      setUpdating(false)
    }
  }

  const handleSuspend = async () => {
    if (!customer || updating) return

    if (!useApi) {
      setCustomer((current) => (current ? { ...current, status: 'Suspend' } : current))
      return
    }

    setUpdating(true)
    try {
      const displayStatus = await submitAdminUserStatus(customer.id, ADMIN_USER_STATUS.SUSPENDED, {
        successText: 'Customer account has been suspended.',
      })
      if (displayStatus) {
        setCustomer((current) => (current ? { ...current, status: displayStatus } : current))
      }
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader title="Customer details" description="Loading customer…" />
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
          <p className="text-sm text-[#64748B]">Loading customer details…</p>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="space-y-6">
        <Link
          to="/admin/customers"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
        >
          <ArrowLeft className="size-4" />
          Back to customers
        </Link>
        <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-6 py-12 text-center">
          <p className="text-base font-semibold text-[#B91C1C]">
            {error || 'Customer not found.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to="/admin/customers"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
          >
            <ArrowLeft className="size-4" />
            Back to customers
          </Link>
          <DashboardPageHeader
            className="mt-3"
            title={customer.userName}
            description={customer.email}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={updating}
            onClick={handleSetActive}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-4 text-sm font-semibold text-[#166534] transition-colors hover:bg-[#DCFCE7] disabled:opacity-60"
          >
            Set active
          </button>
          <button
            type="button"
            disabled={updating}
            onClick={handleSuspend}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 text-sm font-semibold text-[#B91C1C] transition-colors hover:bg-[#FEE2E2] disabled:opacity-60"
          >
            Suspend
          </button>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
          {error}
        </p>
      ) : null}

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-[#111827]">Account</h2>
          <StatusBadge status={customer.status} />
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Phone</dt>
            <dd className="mt-1 text-sm text-[#111827]">{customer.phoneNumber}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">Joined</dt>
            <dd className="mt-1 text-sm text-[#111827]">{customer.joinedDate}</dd>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <dt className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
              Location
            </dt>
            <dd className="mt-1 whitespace-pre-line text-sm text-[#111827]">{customer.location}</dd>
          </div>
        </dl>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Jobs posted', value: customer.jobsPosted },
          { label: 'Bookings', value: customer.bookingsCount },
          { label: 'Completed jobs', value: customer.completedJobs },
          { label: 'Cancelled jobs', value: customer.cancelledJobs },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-[#111827]">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[#111827]">Recent jobs</h2>
        {customer.recentJobs?.length ? (
          <ul className="mt-4 divide-y divide-[#E5E7EB]">
            {customer.recentJobs.map((job) => (
              <li key={job.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{job.title}</p>
                  <p className="mt-1 text-xs text-[#64748B]">
                    {job.location} · {job.createdAt}
                  </p>
                </div>
                <StatusBadge status={job.status} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-[#64748B]">No recent jobs available for this customer.</p>
        )}
      </section>
    </div>
  )
}
