import { Navigate, useNavigate, useParams } from 'react-router'
import JobDetails from '@/components/data-display/JobDetails'
import { getBookingDetails } from '@/data/myBookingsData'
import Cta from '@/pages/public/home/sections/Cta'
import BookingDetailsBreadcrumbs from '@/pages/user/bookings/sections/BookingDetailsBreadcrumbs'

export default function BookingDetailsPage() {
  const navigate = useNavigate()
  const { bookingId } = useParams()
  const booking = getBookingDetails(bookingId)

  if (!booking) {
    return <Navigate to="/my-bookings" replace />
  }

  return (
    <>
      <section className="bg-[#F8FAFC] py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <BookingDetailsBreadcrumbs />

            <JobDetails
              job={booking}
              onMessage={() => navigate('/messages')}
            />
          </div>
        </div>
      </section>
      <Cta postJobTo="/post-job" />
    </>
  )
}
