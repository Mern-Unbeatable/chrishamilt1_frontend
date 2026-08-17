import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import QuoteCard from '@/components/data-display/QuoteCard/QuoteCard'
import QuoteDetailsModal from '@/components/data-display/QuoteDetailsModal'
import { getJobQuote, getJobQuotes } from '@/data/jobQuotesData'
import Cta from '@/pages/public/home/sections/Cta'
import JobQuotesBreadcrumbs from '@/pages/user/jobs/sections/JobQuotesBreadcrumbs'

export default function JobQuotesPage() {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const quotes = getJobQuotes(jobId)
  const [selectedQuoteId, setSelectedQuoteId] = useState(null)
  const selectedQuote = selectedQuoteId ? getJobQuote(jobId, selectedQuoteId) : null

  return (
    <>
      <section className="bg-[#F8FAFC] py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <JobQuotesBreadcrumbs />

            <div className="space-y-4">
              {quotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  variant="customer"
                  tradesman={quote.tradesman}
                  amount={quote.amount}
                  duration={quote.duration}
                  startDate={quote.startDate}
                  distance={quote.distance}
                  responseTime={quote.responseTime}
                  submittedAt={quote.submittedAt}
                  proposalPreview={quote.proposalPreview}
                  statusVariant={quote.statusVariant}
                  onHireTradesman={() => {}}
                  onViewDetails={() => setSelectedQuoteId(quote.id)}
                  onMessage={() => navigate('/messages')}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <QuoteDetailsModal
        open={Boolean(selectedQuote)}
        quote={selectedQuote}
        onClose={() => setSelectedQuoteId(null)}
        onHireTradesman={() => {}}
        onMessage={() => navigate('/messages')}
      />

      <Cta postJobTo="/post-job" />
    </>
  )
}
