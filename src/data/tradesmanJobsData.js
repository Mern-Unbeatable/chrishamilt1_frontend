export const TRADESMAN_JOB_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in progress', label: 'In progress' },
]

export const TRADESMAN_JOB_STATUS_VALUES = {
  COMPLETED: 'Completed',
  ACCEPTED: 'Accepted',
  IN_PROGRESS: 'In progress',
}

export const DEMO_TRADESMAN_JOBS_LIST = [
  {
    id: 'job-002',
    jobId: 'Job-002',
    customerName: 'Aliza',
    phoneNumber: '+421 435 43556',
    price: '$123',
    status: 'Completed',
  },
  {
    id: 'job-003',
    jobId: 'Job-003',
    customerName: 'Sophie Harper',
    phoneNumber: '+44 7700 900123',
    price: '£2,450',
    status: 'Accepted',
  },
  {
    id: 'job-004',
    jobId: 'Job-004',
    customerName: 'James Wright',
    phoneNumber: '+44 161 555 0198',
    price: '£890',
    status: 'In progress',
  },
  {
    id: 'job-005',
    jobId: 'Job-005',
    customerName: 'Emma Collins',
    phoneNumber: '+44 20 7946 0958',
    price: '£1,200',
    status: 'Completed',
  },
  {
    id: 'job-006',
    jobId: 'Job-006',
    customerName: 'Michael Brown',
    phoneNumber: '+44 7700 900456',
    price: '£675',
    status: 'Completed',
  },
  {
    id: 'job-007',
    jobId: 'Job-007',
    customerName: 'Priya Sharma',
    phoneNumber: '+44 7700 900789',
    price: '£1,850',
    status: 'Completed',
  },
  {
    id: 'job-008',
    jobId: 'Job-008',
    customerName: 'Marcus Bell',
    phoneNumber: '+44 161 555 0244',
    price: '£3,100',
    status: 'Completed',
  },
]

export function getTradesmanJob(jobId) {
  return (
    DEMO_TRADESMAN_JOBS_LIST.find(
      (job) => job.id === jobId || job.jobId === jobId,
    ) ?? null
  )
}

export function countActiveTradesmanJobs(jobs) {
  return jobs.filter((job) => {
    const status = job.status.toLowerCase()
    return status === 'accepted' || status === 'in progress'
  }).length
}

export function filterTradesmanJobsByStatus(jobs, statusFilter) {
  if (statusFilter === 'all') return jobs

  return jobs.filter((job) => job.status.toLowerCase() === statusFilter.toLowerCase())
}
