import { fetchTradesmanJobs, isTradesmanJobsApiEnabled } from '@/services/tradesmanJobsApi'

export function isTradesmanScheduleApiEnabled() {
  return isTradesmanJobsApiEnabled()
}

function formatScheduleTime(value) {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function formatGroupLabel(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Upcoming'

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'

  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function mapJobToScheduleItem(job) {
  const scheduledAt = job.scheduledAt
  const date = scheduledAt ? new Date(scheduledAt) : null

  return {
    id: job.bookingId ?? job.id,
    jobId: job.id,
    jobCode: job.jobId,
    title: job.title || `Project for ${job.customerName}`,
    customerName: job.customerName,
    location: job.location || '—',
    status: job.status,
    scheduledAt,
    time: formatScheduleTime(scheduledAt),
    dateKey: date ? date.toISOString().slice(0, 10) : 'unscheduled',
    groupLabel: date ? formatGroupLabel(scheduledAt) : 'Upcoming',
  }
}

function groupScheduleItems(items) {
  const groups = new Map()

  items.forEach((item) => {
    const key = item.dateKey
    if (!groups.has(key)) {
      groups.set(key, {
        dateKey: key,
        label: item.groupLabel,
        items: [],
      })
    }
    groups.get(key).items.push(item)
  })

  return [...groups.values()].sort((left, right) => left.dateKey.localeCompare(right.dateKey))
}

export async function fetchTradesmanSchedule() {
  const result = await fetchTradesmanJobs({ page: 1, limit: 50, statusFilter: 'all' })

  const upcoming = result.jobs
    .filter((job) => {
      const status = String(job.apiStatus ?? job.status ?? '').toUpperCase()
      return status === 'ACCEPTED' || status === 'IN_PROGRESS'
    })
    .map(mapJobToScheduleItem)
    .filter((item) => item.scheduledAt)
    .sort(
      (left, right) =>
        new Date(left.scheduledAt).getTime() - new Date(right.scheduledAt).getTime(),
    )

  return groupScheduleItems(upcoming)
}

export function getDemoTradesmanSchedule() {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)

  return groupScheduleItems([
    mapJobToScheduleItem({
      id: 'job-demo-1',
      bookingId: 'booking-demo-1',
      jobId: 'Job-101',
      title: 'Kitchen rewiring',
      customerName: 'Sarah Miller',
      location: 'Manchester, UK',
      status: 'Accepted',
      apiStatus: 'ACCEPTED',
      scheduledAt: tomorrow.toISOString(),
    }),
  ])
}
