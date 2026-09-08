import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import LeaveReviewModal from '@/components/data-display/LeaveReviewModal'
import JobDetails from '@/components/data-display/JobDetails'
import {
  showApiErrorFromError,
  showConfirmAlert,
  showSuccessAlert,
} from '@/helpers/showAppAlert'
import { getBookingDetails } from '@/data/myBookingsData'
import Cta from '@/pages/public/home/sections/Cta'
import BookingActionsBar from '@/pages/user/bookings/sections/BookingActionsBar'
import BookingDetailsBreadcrumbs from '@/pages/user/bookings/sections/BookingDetailsBreadcrumbs'
import {
  cancelUserBooking,
  fetchUserBookingDetails,
  isUserBookingsApiEnabled,
} from '@/services/userBookingsApi'
import { isUserReviewsApiEnabled, submitJobReview } from '@/services/userReviewsApi'

export default function BookingDetailsPage() {
  const navigate = useNavigate()
  const { bookingId } = useParams()
  const useApi = isUserBookingsApiEnabled()
  const useReviewApi = isUserReviewsApiEnabled()

  const demoBooking = getBookingDetails(bookingId)
  const [booking, setBooking] = useState(useApi ? null : demoBooking)
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  useEffect(() => {
    if (!useApi) {
      setBooking(getBookingDetails(bookingId))
      setLoading(false)
      setError('')
      return undefined
    }

    let cancelled = false

    async function loadBooking() {
      setLoading(true)
      setError('')
      setReviewSubmitted(false)

      try {
        const data = await fetchUserBookingDetails(bookingId)
        if (!cancelled) {
          setBooking(data)
          setReviewSubmitted(Boolean(data.hasReviewed))
        }
      } catch (err) {
        if (!cancelled) {
          setBooking(null)
          setError(err?.message || 'Unable to load booking details.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadBooking()

    return () => {
      cancelled = true
    }
  }, [bookingId, useApi])

  const handleCancel = async () => {
    const confirmation = await showConfirmAlert({
      title: 'Cancel booking?',
      text: 'This booking will be cancelled and the tradesman will be notified.',
      confirmButtonText: 'Cancel booking',
      cancelButtonText: 'Keep booking',
    })

    if (!confirmation.isConfirmed) return

    if (!useApi) {
      navigate('/my-bookings')
      return
    }

    setCancelling(true)

    try {
      await cancelUserBooking(bookingId)
      await showSuccessAlert({
        title: 'Booking cancelled',
        text: 'Your booking has been cancelled.',
      })
      navigate('/my-bookings')
    } catch (err) {
      await showApiErrorFromError(err, 'Unable to cancel booking')
    } finally {
      setCancelling(false)
    }
  }

  const handleSubmitReview = async ({ rating, comment }) => {
    if (!useReviewApi) {
      setReviewSubmitted(true)
      setReviewOpen(false)
      await showSuccessAlert({
        title: 'Review submitted',
        text: 'Thank you for sharing your feedback.',
      })
      return
    }

    setReviewSubmitting(true)

    try {
      await submitJobReview({
        jobId: booking.jobId,
        rating,
        comment,
      })

      setReviewSubmitted(true)
      setReviewOpen(false)

      await showSuccessAlert({
        title: 'Review submitted',
        text: 'Thank you for sharing your feedback.',
      })
    } catch (err) {
      if (String(err?.message ?? '').toLowerCase().includes('already reviewed')) {
        setReviewSubmitted(true)
        setReviewOpen(false)
        await showSuccessAlert({
          title: 'Already reviewed',
          text: 'You have already left a review for this job.',
        })
        return
      }
      await showApiErrorFromError(err, 'Unable to submit review')
    } finally {
      setReviewSubmitting(false)
    }
  }

  if (loading) {
    return (
      <>
        <section className="bg-[#F8FAFC] py-8 lg:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
              <p className="text-sm text-[#64748B]">Loading booking details…</p>
            </div>
          </div>
        </section>
        <Cta postJobTo="/post-job" />
      </>
    )
  }

  if (!booking) {
    return <Navigate to="/my-bookings" replace />
  }

  return (
    <>
      <section className="bg-[#F8FAFC] py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-6">
            <BookingDetailsBreadcrumbs />

            {error ? (
              <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
                {error}
              </p>
            ) : null}

            <BookingActionsBar
              booking={booking}
              reviewSubmitted={reviewSubmitted}
              cancelling={cancelling}
              onCancel={handleCancel}
              onLeaveReview={() => setReviewOpen(true)}
              onMessage={() =>
                navigate('/messages', {
                  state: {
                    tradesmanId: booking.tradesmanId ?? booking.tradesman?.id ?? null,
                    jobId: booking.jobId ?? null,
                  },
                })
              }
            />

            <JobDetails job={booking} showSummary onMessage={undefined} />
          </div>
        </div>
      </section>

      <LeaveReviewModal
        open={reviewOpen}
        tradesmanName={booking.tradesman?.name ?? 'your tradesman'}
        submitting={reviewSubmitting}
        onClose={() => setReviewOpen(false)}
        onSubmit={handleSubmitReview}
      />

      <Cta postJobTo="/post-job" />
    </>
  )
}
