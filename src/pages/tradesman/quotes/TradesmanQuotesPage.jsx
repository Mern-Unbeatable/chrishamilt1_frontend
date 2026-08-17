import { useState } from 'react'
import { useNavigate } from 'react-router'
import QuoteCard from '@/components/data-display/QuoteCard/QuoteCard'
import SendQuoteModal from '@/components/data-display/SendQuoteModal'
import TradesmanQuoteDetailsModal from '@/components/data-display/TradesmanQuoteDetailsModal'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import {
  DEMO_TRADESMAN_QUOTES,
  DEMO_TRADESMAN_QUOTES_SUMMARY,
  getTradesmanQuote,
} from '@/data/tradesmanQuotesData'

export default function TradesmanQuotesPage() {
  const navigate = useNavigate()
  const [quotes, setQuotes] = useState(DEMO_TRADESMAN_QUOTES)
  const [selectedQuoteId, setSelectedQuoteId] = useState(null)
  const [editingQuoteId, setEditingQuoteId] = useState(null)

  const selectedQuote = selectedQuoteId ? getTradesmanQuote(selectedQuoteId) : null
  const editingQuote = editingQuoteId ? getTradesmanQuote(editingQuoteId) : null

  const handleWithdraw = (quoteId) => {
    setQuotes((current) => current.filter((quote) => quote.id !== quoteId))
    if (selectedQuoteId === quoteId) setSelectedQuoteId(null)
  }

  return (
    <>
      <div className="space-y-6">
        <DashboardPageHeader
          title="My quotes"
          description={`${DEMO_TRADESMAN_QUOTES_SUMMARY.submittedThisMonth} quotations submitted this month`}
        />

        {quotes.length > 0 ? (
          <div className="space-y-4">
            {quotes.map((quote) => (
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
                onEditQuote={() => setEditingQuoteId(quote.id)}
                onWithdraw={() => handleWithdraw(quote.id)}
                onMessageCustomer={() => navigate('/tradesman/messages')}
              />
            ))}
          </div>
        ) : (
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
        )}
      </div>

      <TradesmanQuoteDetailsModal
        open={Boolean(selectedQuote)}
        quote={selectedQuote}
        onClose={() => setSelectedQuoteId(null)}
      />

      <SendQuoteModal
        open={Boolean(editingQuote)}
        onClose={() => setEditingQuoteId(null)}
        jobTitle={editingQuote?.title}
        customerBudget={editingQuote?.amount}
        onViewQuotes={() => {
          setEditingQuoteId(null)
          navigate('/tradesman/quotes')
        }}
      />
    </>
  )
}
