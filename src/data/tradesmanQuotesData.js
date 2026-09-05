export const DEMO_TRADESMAN_QUOTES_SUMMARY = {
  submittedThisMonth: 24,
}

const TRADESMAN_QUOTE_TEMPLATE = {
  status: 'Pending',
  statusVariant: 'pending',
  amount: '£5,480',
  amountValue: 5480,
  title: 'Full rewire of 3-bed Victorian terrace',
  customerName: 'Sophie Harper',
  duration: '15 working days',
  tokensUsed: 6,
  jobId: '5',
  description:
    "Thanks for the detail in your listing. I've completed 14 full rewires on Victorian terraces in Islington over the past two years, including full make-good plastering.",
  fullProposal:
    "Thanks for the detail in your listing. I've completed 14 full rewires on Victorian terraces in Islington over the past two years, including full make-good plastering. I can provide references from recent Islington clients and will handle all certification and Part P notifications on completion.",
  materialsIncluded: true,
  materialsLabel: 'Included',
  warranty: '12-month labour guarantee',
  startDate: '15 Aug 2026',
  startDateInput: '2026-08-15',
}

export const DEMO_TRADESMAN_QUOTES = [
  {
    id: 'tq-1',
    quoteId: 'Q-90124',
    postedAt: '2 hours ago',
    ...TRADESMAN_QUOTE_TEMPLATE,
  },
  {
    id: 'tq-2',
    quoteId: 'Q-90125',
    postedAt: '5 hours ago',
    ...TRADESMAN_QUOTE_TEMPLATE,
  },
  {
    id: 'tq-3',
    quoteId: 'Q-90118',
    postedAt: '1 day ago',
    ...TRADESMAN_QUOTE_TEMPLATE,
    status: 'Accepted',
    statusVariant: 'accepted',
    amount: '£4,950',
    title: 'Consumer unit upgrade & partial rewire',
    customerName: 'Marcus Bell',
    jobId: '11',
  },
  {
    id: 'tq-4',
    quoteId: 'Q-90109',
    postedAt: '2 days ago',
    ...TRADESMAN_QUOTE_TEMPLATE,
    status: 'Withdrawn',
    statusVariant: 'withdrawn',
    amount: '£3,200',
    title: 'Emergency burst pipe repair',
    customerName: 'Priya Sharma',
    duration: '2 working days',
    tokensUsed: 3,
    jobId: '6',
  },
]

export function getTradesmanQuote(quoteId) {
  return DEMO_TRADESMAN_QUOTES.find((quote) => quote.id === quoteId) ?? null
}
