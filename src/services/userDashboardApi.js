import { fetchConversations } from '@/services/conversationsApi'
import { fetchUserBookings } from '@/services/userBookingsApi'
import { fetchMyJobs, isUserJobsApiEnabled } from '@/services/userJobsApi'

export function isUserDashboardApiEnabled() {
  return isUserJobsApiEnabled()
}

export async function fetchUserDashboard() {
  const [jobsResult, bookingsResult, conversationsResult] = await Promise.all([
    fetchMyJobs({ page: 1, limit: 3 }),
    fetchUserBookings({ page: 1, limit: 3 }),
    fetchConversations({ page: 1, limit: 10 }),
  ])

  const unreadMessages = (conversationsResult.conversations ?? []).reduce(
    (total, conversation) => total + Number(conversation.unreadCount ?? 0),
    0,
  )

  const openJobs = jobsResult.jobs.filter(
    (job) => String(job.status ?? '').toLowerCase() === 'open',
  ).length

  const activeBookings = bookingsResult.bookings.filter((booking) => {
    const status = String(booking.status ?? '').toLowerCase()
    return status === 'accepted' || status === 'in progress'
  }).length

  return {
    stats: [
      {
        id: 'jobs',
        label: 'Job posts',
        value: String(jobsResult.pagination.total ?? jobsResult.jobs.length),
        subtext: `${openJobs} open`,
        iconKey: 'briefcase',
        iconTone: 'blue',
      },
      {
        id: 'bookings',
        label: 'Bookings',
        value: String(bookingsResult.pagination.total ?? bookingsResult.bookings.length),
        subtext: `${activeBookings} active`,
        iconKey: 'calendar',
        iconTone: 'green',
      },
      {
        id: 'messages',
        label: 'Unread messages',
        value: String(unreadMessages),
        subtext: unreadMessages === 1 ? '1 conversation' : `${unreadMessages} messages`,
        iconKey: 'message',
        iconTone: 'orange',
      },
    ],
    recentJobs: jobsResult.jobs,
    recentBookings: bookingsResult.bookings,
  }
}

export function getDemoUserDashboard() {
  return {
    stats: [
      { id: 'jobs', label: 'Job posts', value: '3', subtext: '2 open', iconKey: 'briefcase', iconTone: 'blue' },
      { id: 'bookings', label: 'Bookings', value: '2', subtext: '1 active', iconKey: 'calendar', iconTone: 'green' },
      { id: 'messages', label: 'Unread messages', value: '1', subtext: '1 conversation', iconKey: 'message', iconTone: 'orange' },
    ],
    recentJobs: [],
    recentBookings: [],
  }
}
