import { useNavigate } from 'react-router'
import JobDetails from '@/components/data-display/JobDetails'
import { DEMO_JOB_DETAILS, DEMO_SIMILAR_JOBS } from '@/data/demoData'
import JobDetailsBreadcrumbs from '@/pages/public/jobs/sections/JobDetailsBreadcrumbs'
import JobDetailsCustomer from '@/pages/public/jobs/sections/JobDetailsCustomer'
import JobDetailsSummary from '@/pages/public/jobs/sections/JobDetailsSummary'
import SimilarJobsNearYou from '@/pages/public/jobs/sections/SimilarJobsNearYou'

export default function JobDetailsPage() {
  const navigate = useNavigate()

  const handleSendQuote = () => navigate('/auth/login')

  return (
    <section className="bg-[#F8FAFC] py-8 lg:py-12">
      <div className="container mx-auto px-6 lg:px-8">
        <JobDetailsBreadcrumbs category={DEMO_JOB_DETAILS.category} />

        <div className="space-y-6">
          <JobDetailsSummary job={DEMO_JOB_DETAILS} onSendQuote={handleSendQuote} />
          <JobDetailsCustomer customer={DEMO_JOB_DETAILS.customer} />

          <JobDetails
            job={DEMO_JOB_DETAILS}
            showSummary={false}
            showTradesman={false}
          />

          {/* <SimilarJobsNearYou jobs={DEMO_SIMILAR_JOBS} /> */}
        </div>
      </div>
    </section>
  )
}
