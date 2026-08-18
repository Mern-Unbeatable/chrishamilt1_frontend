import { DEMO_ADMIN_TRADESMEN } from '@/data/demoData'

const DEFAULT_DETAIL = {
  initials: 'TT',
  memberSince: '2024-01-15',
  stats: {
    totalEarned: '£12,400',
    jobsCompleted: 8,
    quoteWinRate: '42%',
    avgJobValue: '£1,550',
    totalQuotesSent: 19,
    jobsWon: '8 of 19',
    tokensPurchased: 100,
    tokensRemaining: 22,
  },
  tokens: {
    purchased: 100,
    used: 78,
    remaining: 22,
    totalSpent: '£74.97',
    history: [
      {
        id: '1',
        name: 'Professional Pack',
        date: '2024-09-10',
        price: '£24.99',
        tokens: 100,
      },
    ],
  },
  completedJobs: {
    summary: { count: 2, earned: '£12,400' },
    footer: { quotesSent: 19, jobsWon: 8, avgValue: '£1,550' },
    jobs: [
      {
        id: '1',
        title: 'Kitchen Rewire',
        client: 'Sarah Nichols',
        date: '2024-08-20',
        price: '£6,400',
        status: 'Completed',
      },
      {
        id: '2',
        title: 'Bathroom Fan Install',
        client: 'Marcus Williams',
        date: '2024-07-14',
        price: '£600',
        status: 'Completed',
      },
    ],
  },
  reviews: {
    averageRating: 4.5,
    totalReviews: 2,
    distribution: [
      { stars: '5', count: 1 },
      { stars: '4', count: 1 },
      { stars: '3', count: 0 },
      { stars: '2', count: 0 },
      { stars: '1', count: 0 },
    ],
    items: [
      {
        id: '1',
        name: 'Sarah Nichols',
        initials: 'SN',
        rating: 5,
        date: 'Aug 22, 2024',
        text: 'Professional service from start to finish. Would hire again.',
      },
      {
        id: '2',
        name: 'Marcus Williams',
        initials: 'MW',
        rating: 4,
        date: 'Jul 18, 2024',
        text: 'Good work overall, arrived on time and cleaned up after.',
      },
    ],
  },
}

const ANNETTE_DETAIL = {
  initials: 'AB',
  memberSince: '2023-09-12',
  stats: {
    totalEarned: '£28,400',
    jobsCompleted: 16,
    quoteWinRate: '56%',
    avgJobValue: '£1,775',
    totalQuotesSent: 32,
    jobsWon: '18 of 32',
    tokensPurchased: 200,
    tokensRemaining: 45,
  },
  tokens: {
    purchased: 200,
    used: 155,
    remaining: 45,
    totalSpent: '£174.97',
    history: [
      {
        id: '1',
        name: 'Enterprise Pack',
        date: '2024-11-02',
        price: '£99.99',
        tokens: 1000,
      },
      {
        id: '2',
        name: 'Business Pack',
        date: '2024-08-18',
        price: '£49.99',
        tokens: 500,
      },
      {
        id: '3',
        name: 'Professional Pack',
        date: '2024-05-04',
        price: '£24.99',
        tokens: 100,
      },
    ],
  },
  completedJobs: {
    summary: { count: 4, earned: '£28,400' },
    footer: { quotesSent: 32, jobsWon: 18, avgValue: '£1,775' },
    jobs: [
      {
        id: '1',
        title: 'Boiler Replacement',
        client: 'James Whitfield',
        date: '2024-10-15',
        price: '£8,200',
        status: 'Completed',
      },
      {
        id: '2',
        title: 'Full House Rewire',
        client: 'Olivia Clarke',
        date: '2024-09-03',
        price: '£12,500',
        status: 'Completed',
      },
      {
        id: '3',
        title: 'Consumer Unit Upgrade',
        client: 'Laura Jones',
        date: '2024-07-22',
        price: '£1,850',
        status: 'Completed',
      },
      {
        id: '4',
        title: 'Outdoor Lighting',
        client: 'Michael Brown',
        date: '2024-06-10',
        price: '£5,850',
        status: 'Completed',
      },
    ],
  },
  reviews: {
    averageRating: 4.7,
    totalReviews: 3,
    distribution: [
      { stars: '5', count: 2 },
      { stars: '4', count: 1 },
      { stars: '3', count: 0 },
      { stars: '2', count: 0 },
      { stars: '1', count: 0 },
    ],
    items: [
      {
        id: '1',
        name: 'James Whitfield',
        initials: 'JW',
        rating: 5,
        date: 'Oct 18, 2024',
        text: 'Excellent work on our boiler replacement. Annette was punctual, tidy, and explained everything clearly.',
      },
      {
        id: '2',
        name: 'Olivia Clarke',
        initials: 'OC',
        rating: 5,
        date: 'Sep 10, 2024',
        text: 'Full rewire completed ahead of schedule. Very professional and fair pricing throughout.',
      },
      {
        id: '3',
        name: 'Laura Jones',
        initials: 'LJ',
        rating: 4,
        date: 'Jul 28, 2024',
        text: 'Good quality work on the consumer unit. Minor delay on parts but kept us informed.',
      },
    ],
  },
}

const DETAIL_OVERRIDES = {
  '1': ANNETTE_DETAIL,
}

function buildInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function getAdminTradesmanDetail(tradesmanId) {
  const profile = DEMO_ADMIN_TRADESMEN.find((item) => item.id === tradesmanId)
  if (!profile) return null

  const detail = DETAIL_OVERRIDES[tradesmanId] ?? DEFAULT_DETAIL

  return {
    ...profile,
    ...detail,
    initials: detail.initials || buildInitials(profile.tradesmanName),
    tokens: {
      ...detail.tokens,
      used: detail.tokens.used ?? detail.tokens.purchased - detail.tokens.remaining,
    },
  }
}
