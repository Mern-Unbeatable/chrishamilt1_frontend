import { useNavigate } from 'react-router'
import JobDetails from '@/components/data-display/JobDetails'
import { DEMO_JOB_DETAILS } from '@/data/demoData'

export default function JobDetailsPage() {
  const navigate = useNavigate()

  return (
    <section className="bg-[#F8FAFC] py-10 lg:py-14">
      <div className="container mx-auto px-6 lg:px-8">
        <JobDetails
          job={DEMO_JOB_DETAILS}
          onMessage={() => navigate('/auth/login')}
        />
      </div>
    </section>
  )
}
