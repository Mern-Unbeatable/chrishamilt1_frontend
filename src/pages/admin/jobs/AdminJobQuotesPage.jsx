import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'
import QuoteCard from '@/components/data-display/QuoteCard/QuoteCard'
import QuoteDetailsModal from '@/components/data-display/QuoteDetailsModal'
import { DEMO_BROWSE_JOBS } from '@/data/demoData'
import {
  fetchJobQuotes,
  getDemoQuotesForJob,
  isJobQuotesApiEnabled,
} from '@/services/jobQuotesApi'
import { fetchPublicJobDetails } from '@/services/publicJobsApi'

export default function AdminJobQuotesPage() {
  const { jobId } = useParams()
  const useApi = isJobQuotesApiEnabled()

  const [quotes, setQuotes] = useState([])
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')
  const [selectedQuoteId, setSelectedQuoteId] = useState(null)

  const selectedQuote = quotes.find((quote) => quote.id === selectedQuoteId) || null

  useEffect(() => {
    if (!useApi) {
      const browseJob = DEMO_BROWSE_JOBS.find((item) => item.id === jobId)
      setJob(browseJob || null)
      setQuotes(getDemoQuotesForJob(jobId))
      setLoading(false)
      setError('')
      return undefined
    }

    let cancelled = false

    async function loadQuotes() {
      setLoading(true)
      setError('')

      try {
        const result = await fetchJobQuotes(jobId)

        if (cancelled) return

        setQuotes(result.quotes)

        if (result.job) {
          setJob(result.job)
        } else {
          // If no quotes exist, fetch job details separately to show title
          try {
            const jobDetails = await fetchPublicJobDetails(jobId)
            if (!cancelled) setJob(jobDetails)
          } catch {
            // Keep job as null if public job details not reachable
          }
        }
      } catch (err) {
        if (cancelled) return
        setQuotes([])
        setError(err?.message || 'Unable to load quotes for this job.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadQuotes()

    return () => {
      cancelled = true
    }
  }, [jobId, useApi])

  const jobTitle = job?.title || 'Job'

  return (
    <>
      <div className="space-y-4">
        <Link
          to={`/admin/jobs/${jobId}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#64748B] transition-colors hover:text-[#111827]"
        >
          <ChevronLeft className="size-4 shrink-0" strokeWidth={2} />
          Back to job details
        </Link>

        {error ? (
          <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
            <p className="text-sm text-[#64748B]">Loading job quotes…</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#64748B]">
              {quotes.length} {quotes.length === 1 ? 'quote' : 'quotes'} for{' '}
              <span className="font-semibold text-[#111827]">{jobTitle}</span>
            </p>

            {quotes.length > 0 ? (
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
            ) : (
              <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-6 py-12 text-center">
                <p className="text-base font-semibold text-[#111827]">No quotes submitted yet</p>
                <p className="mt-2 text-sm text-[#64748B]">
                  No tradesmen have submitted quotes for this job yet.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <QuoteDetailsModal
        open={Boolean(selectedQuote)}
        quote={selectedQuote}
        onClose={() => setSelectedQuoteId(null)}
      />
    </>
  )
}
