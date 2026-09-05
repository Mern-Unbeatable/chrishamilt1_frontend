import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Pagination from '@/components/common/Pagination/Pagination'
import QuoteCard from '@/components/data-display/QuoteCard/QuoteCard'
import SendQuoteModal from '@/components/data-display/SendQuoteModal'
import TradesmanQuoteDetailsModal from '@/components/data-display/TradesmanQuoteDetailsModal'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import { DEMO_TRADESMAN_QUOTES_SUMMARY } from '@/data/tradesmanQuotesData'
import { submitQuoteUpdate } from '@/helpers/submitQuoteUpdate'
import { submitQuoteWithdraw } from '@/helpers/submitQuoteWithdraw'
import {
  fetchMyQuotes,
  fetchQuoteDetails,
  getDemoTradesmanQuoteDetails,
  getDemoTradesmanQuotesPage,
  isTradesmanQuotesApiEnabled,
  mapQuoteCardToFormValues,
  TRADESMAN_QUOTES_PAGE_SIZE,
} from '@/services/tradesmanQuotesApi'

const PAGE_SIZE = TRADESMAN_QUOTES_PAGE_SIZE

export default function TradesmanQuotesPage() {
  const navigate = useNavigate()
  const listRef = useRef(null)
  const useApi = isTradesmanQuotesApiEnabled()

  const [quotes, setQuotes] = useState([])
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')
  const [selectedQuoteId, setSelectedQuoteId] = useState(null)
  const [editingQuoteId, setEditingQuoteId] = useState(null)
  const [withdrawingId, setWithdrawingId] = useState('')
  const [demoQuoteOverrides, setDemoQuoteOverrides] = useState({})
  const [detailQuote, setDetailQuote] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [editingQuoteDetails, setEditingQuoteDetails] = useState(null)

  const demoResult = useMemo(() => {
    const base = getDemoTradesmanQuotesPage(page, PAGE_SIZE)

    return {
      ...base,
      quotes: base.quotes.map((quote) => demoQuoteOverrides[quote.id] ?? quote),
    }
  }, [page, demoQuoteOverrides])

  useEffect(() => {
    if (!useApi) return undefined

    let cancelled = false

    async function loadQuotes() {
      setLoading(true)
      setError('')

      try {
        const result = await fetchMyQuotes({ page, limit: PAGE_SIZE })

        if (cancelled) return

        setQuotes(result.quotes)
        setTotalCount(result.pagination.total ?? result.quotes.length)
        setTotalPages(Math.max(1, result.pagination.totalPages ?? 1))
      } catch (err) {
        if (cancelled) return

        setQuotes([])
        setTotalCount(0)
        setTotalPages(1)
        setError(err?.message || 'Unable to load your quotes right now.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadQuotes()

    return () => {
      cancelled = true
    }
  }, [useApi, page])

  useEffect(() => {
    if (!selectedQuoteId) {
      setDetailQuote(null)
      setDetailLoading(false)
      setDetailError('')
      return undefined
    }

    let cancelled = false

    async function loadQuoteDetails() {
      setDetailLoading(true)
      setDetailError('')

      try {
        const quote = useApi
          ? await fetchQuoteDetails(selectedQuoteId)
          : demoQuoteOverrides[selectedQuoteId] ??
            getDemoTradesmanQuoteDetails(selectedQuoteId)

        if (cancelled) return

        if (!quote) {
          setDetailQuote(null)
          setDetailError('Quote not found.')
          return
        }

        setDetailQuote(quote)
      } catch (err) {
        if (cancelled) return

        setDetailQuote(null)
        setDetailError(err?.message || 'Unable to load quote details.')
      } finally {
        if (!cancelled) setDetailLoading(false)
      }
    }

    loadQuoteDetails()

    return () => {
      cancelled = true
    }
  }, [selectedQuoteId, useApi, demoQuoteOverrides])

  useEffect(() => {
    if (!editingQuoteId) {
      setEditingQuoteDetails(null)
      return undefined
    }

    let cancelled = false

    async function loadEditingQuote() {
      try {
        const quote = useApi
          ? await fetchQuoteDetails(editingQuoteId)
          : demoQuoteOverrides[editingQuoteId] ??
            getDemoTradesmanQuoteDetails(editingQuoteId)

        if (cancelled) return
        if (quote) setEditingQuoteDetails(quote)
      } catch {
        if (cancelled) return
        // Keep the list-card seed data if the detail request fails.
      }
    }

    loadEditingQuote()

    return () => {
      cancelled = true
    }
  }, [editingQuoteId, useApi])

  const displayQuotes = useApi ? quotes : demoResult.quotes
  const displayTotalCount = useApi ? totalCount : demoResult.pagination.total
  const displayTotalPages = useApi ? totalPages : demoResult.pagination.totalPages

  const editingInitialValues = useMemo(
    () => (editingQuoteDetails ? mapQuoteCardToFormValues(editingQuoteDetails) : null),
    [editingQuoteDetails],
  )

  const headerDescription = loading
    ? 'Loading quotes…'
    : useApi
      ? `${displayTotalCount} ${displayTotalCount === 1 ? 'quotation' : 'quotations'} submitted`
      : `${DEMO_TRADESMAN_QUOTES_SUMMARY.submittedThisMonth} quotations submitted this month`

  const handleWithdraw = async (quoteId) => {
    if (withdrawingId) return

    const quote = displayQuotes.find((item) => item.id === quoteId)
    setWithdrawingId(quoteId)

    try {
      const updated = await submitQuoteWithdraw(quoteId, { existingQuote: quote })
      if (!updated) return

      if (useApi) {
        setQuotes((current) =>
          current.map((item) => (item.id === quoteId ? { ...item, ...updated } : item)),
        )
      } else {
        setDemoQuoteOverrides((current) => ({
          ...current,
          [quoteId]: { ...(current[quoteId] ?? quote), ...updated },
        }))
      }

      if (selectedQuoteId === quoteId) setSelectedQuoteId(null)
      if (editingQuoteId === quoteId) setEditingQuoteId(null)
    } finally {
      setWithdrawingId('')
    }
  }

  const handleEditQuote = (quote) => {
    setEditingQuoteDetails(quote)
    setEditingQuoteId(quote.id)
  }

  const handlePageChange = (nextPage) => {
    setPage(nextPage)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleUpdateQuote = async (form) => {
    if (!editingQuoteId) return null

    const updated = await submitQuoteUpdate(editingQuoteId, form, {
      existingQuote: editingQuoteDetails,
    })

    if (!updated) return null

    if (useApi) {
      setQuotes((current) =>
        current.map((quote) => (quote.id === updated.id ? updated : quote)),
      )
    } else {
      setDemoQuoteOverrides((current) => ({
        ...current,
        [updated.id]: updated,
      }))
    }

    return updated
  }

  return (
    <>
      <div className="space-y-6">
        <DashboardPageHeader title="My quotes" description={headerDescription} />

        {error ? (
          <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-6 py-8 text-center">
            <p className="text-sm font-semibold text-[#B91C1C]">{error}</p>
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
            <p className="text-sm text-[#64748B]">Loading your quotes…</p>
          </div>
        ) : displayQuotes.length > 0 ? (
          <div ref={listRef} className="scroll-mt-24 space-y-4">
            {displayQuotes.map((quote) => {
              const isWithdrawn = quote.statusVariant === 'withdrawn'

              return (
                <QuoteCard
                  key={quote.id}
                  variant="tradesman"
                  quoteId={quote.quoteId}
                  status={quote.status}
                  statusVariant={quote.statusVariant}
                  postedAt={quote.postedAt}
                  amount={quote.amount}
                  title={quote.title}
                  customerName={quote.customerName}
                  duration={quote.duration}
                  tokensUsed={quote.tokensUsed}
                  description={quote.description}
                  onOpenJob={
                    quote.jobId
                      ? () => navigate(`/tradesman/browse-jobs/${quote.jobId}`)
                      : undefined
                  }
                  onViewDetails={() => setSelectedQuoteId(quote.id)}
                  onEditQuote={isWithdrawn ? undefined : () => handleEditQuote(quote)}
                  onWithdraw={
                    isWithdrawn || withdrawingId === quote.id
                      ? undefined
                      : () => handleWithdraw(quote.id)
                  }
                  onMessageCustomer={() => navigate('/tradesman/messages')}
                />
              )
            })}

            <Pagination
              page={page}
              totalPages={displayTotalPages}
              onPageChange={handlePageChange}
              className="mt-4"
            />
          </div>
        ) : !error ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-16 text-center">
            <p className="text-base font-semibold text-[#111827]">No quotes yet</p>
            <p className="mt-2 text-sm text-[#64748B]">
              Browse live jobs and submit your first quote to start winning work.
            </p>
            <button
              type="button"
              onClick={() => navigate('/tradesman/browse-jobs')}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-btn-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
            >
              Browse jobs
            </button>
          </div>
        ) : null}
      </div>

      <TradesmanQuoteDetailsModal
        open={Boolean(selectedQuoteId)}
        quote={detailQuote}
        loading={detailLoading}
        error={detailError}
        onClose={() => setSelectedQuoteId(null)}
      />

      <SendQuoteModal
        key={editingQuoteId ?? 'quote-edit-closed'}
        open={Boolean(editingQuoteId)}
        mode="edit"
        initialValues={editingInitialValues}
        onClose={() => setEditingQuoteId(null)}
        jobTitle={editingQuoteDetails?.title}
        customerBudget={editingQuoteDetails?.amount}
        onSubmit={handleUpdateQuote}
        onViewQuotes={() => {
          setEditingQuoteId(null)
          navigate('/tradesman/quotes')
        }}
      />
    </>
  )
}
