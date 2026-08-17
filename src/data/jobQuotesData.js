const DANIEL_HUGHES_QUOTE_DETAILS = {
  tradesman: {
    name: 'Daniel Hughes',
    initials: 'DH',
    avatar: null,
    rating: 4.4,
    reviewCount: 87,
    jobsCompleted: 203,
    yearsExperience: 5,
  },
  amount: '£2,100',
  duration: '3 days',
  startDate: '9 Aug 2026',
  distance: '7.6 miles',
  responseTime: '4 hours',
  submittedAt: 'Submitted 1 day ago',
  statusVariant: 'submitted',
  proposalPreview:
    'Competitive quote including all labour. Happy to discuss materials separately and work around your schedule for minimal disruption to the household.',
  materialsIncluded: false,
  materialsLabel: 'Not Included',
  warrantyDays: 0,
  specialties: ['Rewire', 'Fuse Boards', 'Sockets & Lighting'],
  fullProposal:
    'A full site survey will be carried out before work begins. I will complete a systematic installation with power maintained to critical areas throughout the project. On completion you will receive an EICR report and all Part P notifications. I hold public liability insurance up to £5 million.',
  reviews: [
    {
      id: 'r-1',
      name: 'Catherine M.',
      date: 'Jun 2026',
      rating: 5,
      text: 'Absolutely fantastic work, arrived on time and cleaned up perfectly. Would hire again without hesitation.',
    },
    {
      id: 'r-2',
      name: 'Robert T.',
      date: 'May 2026',
      rating: 5,
      text: 'Professional, reasonably priced and the quality of work was superb. Highly recommended.',
    },
    {
      id: 'r-3',
      name: 'Priya S.',
      date: 'Apr 2026',
      rating: 4,
      text: 'Great job overall, took a little longer than expected but the finish was excellent.',
    },
  ],
}

export const DEMO_JOB_QUOTES = {
  1: [
    { id: 'q-101', ...DANIEL_HUGHES_QUOTE_DETAILS },
    { id: 'q-102', ...DANIEL_HUGHES_QUOTE_DETAILS },
    { id: 'q-103', ...DANIEL_HUGHES_QUOTE_DETAILS },
  ],
}

export function getJobQuotes(jobId) {
  return DEMO_JOB_QUOTES[jobId] ?? DEMO_JOB_QUOTES[1]
}

export function getJobQuote(jobId, quoteId) {
  return getJobQuotes(jobId).find((quote) => quote.id === quoteId) ?? null
}
