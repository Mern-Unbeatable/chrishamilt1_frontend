import { useNavigate } from 'react-router'
import JobDetails from '@/components/data-display/JobDetails'
import { DEMO_JOB_DETAILS } from '@/data/demoData'

export default function TradesmanJobDetailsPage() {
  const navigate = useNavigate()

  return (
    <JobDetails
      job={DEMO_JOB_DETAILS}
      onMessage={() => navigate('/tradesman/messages')}
    />
  )
}
