import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'
import QuoteCard from '@/components/data-display/QuoteCard/QuoteCard'
import QuoteDetailsModal from '@/components/data-display/QuoteDetailsModal'
import { DEMO_BROWSE_JOBS } from '@/data/demoData'
import { getJobQuote, getJobQuotes } from '@/data/jobQuotesData'

export default function AdminJobQuotesPage() {
  const { jobId } = useParams()
  const browseJob = DEMO_BROWSE_JOBS.find((item) => item.id === jobId)
  const quotes = getJobQuotes(jobId)
  const [selectedQuoteId, setSelectedQuoteId] = useState(null)
  const selectedQuote = selectedQuoteId ? getJobQuote(jobId, selectedQuoteId) : null

  if (!browseJob) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/jobs"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
        >
          <ChevronLeft className="size-4 shrink-0" strokeWidth={2} />
          Back
        </Link>
        <p className="text-sm text-[#64748B]">Job not found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <Link
          to={`/admin/jobs/${jobId}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
        >
          <ChevronLeft className="size-4 shrink-0" strokeWidth={2} />
          Back
        </Link>

        <p className="text-sm text-[#64748B]">
          {quotes.length} {quotes.length === 1 ? 'quote' : 'quotes'} for{' '}
          <span className="font-semibold text-[#111827]">{browseJob.title}</span>
        </p>

        <div className="flex flex-col gap-4">
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
              onViewDetails={() => setSelectedQuoteId(quote.id)}
            />
          ))}
        </div>
      </div>

      <QuoteDetailsModal
        open={Boolean(selectedQuote)}
        quote={selectedQuote}
        onClose={() => setSelectedQuoteId(null)}
      />
    </>
  )
}
