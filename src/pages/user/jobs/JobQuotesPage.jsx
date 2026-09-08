import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import QuoteCard from '@/components/data-display/QuoteCard/QuoteCard'
import QuoteDetailsModal from '@/components/data-display/QuoteDetailsModal'
import {
  showApiErrorFromError,
  showConfirmAlert,
  showSuccessAlert,
} from '@/helpers/showAppAlert'
import { getJobQuote, getJobQuotes } from '@/data/jobQuotesData'
import Cta from '@/pages/public/home/sections/Cta'
import JobQuotesBreadcrumbs from '@/pages/user/jobs/sections/JobQuotesBreadcrumbs'
import {
  fetchJobQuotes,
  getDemoQuotesForJob,
  hireQuote,
  isJobQuotesApiEnabled,
} from '@/services/jobQuotesApi'

export default function JobQuotesPage() {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const useApi = isJobQuotesApiEnabled()

  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')
  const [selectedQuoteId, setSelectedQuoteId] = useState(null)
  const [hiringId, setHiringId] = useState('')

  const demoQuotes = useMemo(() => getDemoQuotesForJob(jobId), [jobId])

  useEffect(() => {
    if (!useApi) {
      setQuotes(demoQuotes)
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
        if (!cancelled) setQuotes(result.quotes)
      } catch (err) {
        if (!cancelled) {
          setQuotes([])
          setError(err?.message || 'Unable to load quotes right now.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadQuotes()

    return () => {
      cancelled = true
    }
  }, [demoQuotes, jobId, useApi])

  const selectedQuote = useMemo(() => {
    if (!selectedQuoteId) return null

    if (useApi) {
      return quotes.find((quote) => quote.id === selectedQuoteId) ?? null
    }

    return getJobQuote(jobId, selectedQuoteId)
  }, [jobId, quotes, selectedQuoteId, useApi])

  const handleHire = async (quote) => {
    const confirmation = await showConfirmAlert({
      title: 'Hire this tradesman?',
      text: `Confirm hiring ${quote.tradesman?.name ?? 'this tradesman'} for ${quote.amount}.`,
      confirmButtonText: 'Hire tradesman',
      cancelButtonText: 'Not yet',
    })

    if (!confirmation.isConfirmed) return

    if (!useApi) {
      await showSuccessAlert({
        title: 'Tradesman hired',
        text: 'Booking is simulated in demo mode.',
      })
      navigate('/my-bookings')
      return
    }

    setHiringId(quote.id)

    try {
      await hireQuote(quote.id)
      await showSuccessAlert({
        title: 'Tradesman hired',
        text: 'Your booking has been created.',
      })
      navigate('/my-bookings')
    } catch (err) {
      await showApiErrorFromError(err, 'Unable to hire tradesman')
    } finally {
      setHiringId('')
    }
  }

  const handleMessage = (quote) => {
    navigate('/messages', {
      state: {
        tradesmanId: quote.tradesman?.id ?? null,
        jobId: quote.jobId ?? jobId ?? null,
      },
    })
  }

  return (
    <>
      <section className="bg-[#F8FAFC] py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <JobQuotesBreadcrumbs />

            {error ? (
              <p className="mb-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
                {error}
              </p>
            ) : null}

            {loading ? (
              <div className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
                <p className="text-sm text-[#64748B]">Loading quotes…</p>
              </div>
            ) : (
              <div className="space-y-4">
                {quotes.length ? (
                  quotes.map((quote) => (
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
                      onHireTradesman={
                        hiringId === quote.id ? undefined : () => handleHire(quote)
                      }
                      onViewDetails={() => setSelectedQuoteId(quote.id)}
                      onMessage={() => handleMessage(quote)}
                    />
                  ))
                ) : (
                  <div className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
                    <p className="text-base font-semibold text-[#111827]">No quotes yet</p>
                    <p className="mt-2 text-sm text-[#64748B]">
                      Tradesmen will appear here once they submit quotes for your job.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <QuoteDetailsModal
        open={Boolean(selectedQuote)}
        quote={selectedQuote}
        onClose={() => setSelectedQuoteId(null)}
        onHireTradesman={
          selectedQuote && hiringId !== selectedQuote.id
            ? () => handleHire(selectedQuote)
            : undefined
        }
        onMessage={() => {
          if (selectedQuote) handleMessage(selectedQuote)
        }}
      />

      <Cta postJobTo="/post-job" />
    </>
  )
}
