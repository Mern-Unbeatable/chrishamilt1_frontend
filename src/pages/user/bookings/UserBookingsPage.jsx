import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Pagination from '@/components/common/Pagination/Pagination'
import JobCard from '@/components/data-display/JobCard/JobCard'
import {
  showApiErrorFromError,
  showConfirmAlert,
  showSuccessAlert,
} from '@/helpers/showAppAlert'
import Cta from '@/pages/public/home/sections/Cta'
import {
  cancelUserBooking,
  fetchUserBookings,
  getDemoUserBookingsPage,
  isUserBookingsApiEnabled,
  USER_BOOKINGS_PAGE_SIZE,
} from '@/services/userBookingsApi'

const PAGE_SIZE = USER_BOOKINGS_PAGE_SIZE

export default function UserBookingsPage() {
  const navigate = useNavigate()
  const listRef = useRef(null)
  const useApi = isUserBookingsApiEnabled()

  const [page, setPage] = useState(1)
  const [bookings, setBookings] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState('')

  const demoResult = useMemo(() => getDemoUserBookingsPage(page, PAGE_SIZE), [page])

  useEffect(() => {
    if (!useApi) {
      setBookings(demoResult.bookings)
      setTotalPages(demoResult.pagination.totalPages)
      setTotalCount(demoResult.pagination.total)
      setLoading(false)
      setError('')
      return undefined
    }

    let cancelled = false

    async function loadBookings() {
      setLoading(true)
      setError('')

      try {
        const result = await fetchUserBookings({ page, limit: PAGE_SIZE })
        if (cancelled) return

        setBookings(result.bookings)
        setTotalPages(result.pagination.totalPages)
        setTotalCount(result.pagination.total)
      } catch (err) {
        if (cancelled) return

        setBookings([])
        setTotalPages(1)
        setTotalCount(0)
        setError(err?.message || 'Unable to load bookings right now.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadBookings()

    return () => {
      cancelled = true
    }
  }, [demoResult.bookings, demoResult.pagination.total, demoResult.pagination.totalPages, page, useApi])

  const handlePageChange = (nextPage) => {
    setPage(nextPage)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleCancel = async (booking) => {
    const confirmation = await showConfirmAlert({
      title: 'Cancel booking?',
      text: `"${booking.title}" will be cancelled.`,
      confirmButtonText: 'Cancel booking',
      cancelButtonText: 'Keep booking',
    })

    if (!confirmation.isConfirmed) return

    if (!useApi) {
      setBookings((current) => current.filter((item) => item.id !== booking.id))
      return
    }

    setCancellingId(booking.id)

    try {
      await cancelUserBooking(booking.id)

      const targetPage = bookings.length === 1 && page > 1 ? page - 1 : page
      const result = await fetchUserBookings({ page: targetPage, limit: PAGE_SIZE })

      setBookings(result.bookings)
      setTotalPages(result.pagination.totalPages)
      setTotalCount(result.pagination.total)

      if (targetPage !== page) {
        setPage(targetPage)
      }

      await showSuccessAlert({
        title: 'Booking cancelled',
        text: 'Your booking has been cancelled.',
      })
    } catch (err) {
      await showApiErrorFromError(err, 'Unable to cancel booking')
    } finally {
      setCancellingId('')
    }
  }

  const hasBookings = useApi ? totalCount > 0 : bookings.length > 0

  return (
    <>
      <section className="bg-[#F8FAFC] py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={listRef} className="mx-auto max-w-4xl scroll-mt-24">
            <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">My Booking</h1>

            {error ? (
              <p className="mt-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
                {error}
              </p>
            ) : null}

            {loading ? (
              <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
                <p className="text-sm text-[#64748B]">Loading bookings…</p>
              </div>
            ) : hasBookings ? (
              <>
                <div className="mt-6 space-y-4">
                  {bookings.map((booking) => (
                    <JobCard
                      key={booking.id}
                      variant="booking"
                      {...booking}
                      onCancel={
                        cancellingId === booking.id ? undefined : () => handleCancel(booking)
                      }
                      onOpen={() => navigate(`/my-bookings/${booking.id}`)}
                    />
                  ))}
                </div>

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  className="mt-8"
                />
              </>
            ) : (
              <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
                <p className="text-base font-semibold text-[#111827]">No bookings yet</p>
                <p className="mt-2 text-sm text-[#64748B]">
                  Hire a tradesman from your job quotes to see bookings here.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/my-jobs')}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-btn-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
                >
                  View My Job Post
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <Cta postJobTo="/post-job" />
    </>
  )
}
