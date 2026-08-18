import { DEMO_TOKEN_PRICING } from '@/data/demoData'

export const DEMO_ADMIN_TOKEN_PACKAGES = DEMO_TOKEN_PRICING.map((plan) => ({ ...plan }))

export const DEMO_ADMIN_TOKEN_RULES = [
  {
    id: '1',
    label: 'Under £1,000',
    minBudget: 0,
    maxBudget: 1000,
    tokenCost: 2,
    status: 'Active',
  },
  {
    id: '2',
    label: '£1,000 – £2,000',
    minBudget: 1000,
    maxBudget: 2000,
    tokenCost: 3,
    status: 'Active',
  },
  {
    id: '3',
    label: '£2,001 – £5,000',
    minBudget: 2001,
    maxBudget: 5000,
    tokenCost: 5,
    status: 'Active',
  },
  {
    id: '4',
    label: 'Small Jobs',
    minBudget: 0,
    maxBudget: 500,
    tokenCost: 10,
    status: 'Active',
  },
  {
    id: '5',
    label: 'Medium Jobs',
    minBudget: 501,
    maxBudget: 2000,
    tokenCost: 15,
    status: 'Active',
  },
  {
    id: '6',
    label: '£5,001 – £10,000',
    minBudget: 5001,
    maxBudget: 10000,
    tokenCost: 8,
    status: 'Active',
  },
  {
    id: '7',
    label: '£10,001 – £25,000',
    minBudget: 10001,
    maxBudget: 25000,
    tokenCost: 12,
    status: 'Active',
  },
  {
    id: '8',
    label: '£25,001+',
    minBudget: 25001,
    maxBudget: null,
    tokenCost: 15,
    status: 'Active',
  },
]

export const DEMO_ADMIN_TOKEN_PURCHASES = [
  {
    id: '1',
    tradesmanName: "Connor O'Brien",
    company: 'BuildRight Plumbing',
    packageName: 'Business',
    tokens: 1000,
    amount: '£200',
    status: 'Paid',
    date: '2024-04-24',
  },
  {
    id: '2',
    tradesmanName: 'Annette Black',
    company: 'Black Electrical Ltd',
    packageName: 'Professional',
    tokens: 500,
    amount: '£120',
    status: 'Paid',
    date: '2024-04-22',
  },
  {
    id: '3',
    tradesmanName: 'Daniel Hughes',
    company: 'DH Rewires',
    packageName: 'Starter',
    tokens: 100,
    amount: '£30',
    status: 'Paid',
    date: '2024-04-20',
  },
  {
    id: '4',
    tradesmanName: 'Leslie Alexander',
    company: 'Alexander Roofing',
    packageName: 'Business',
    tokens: 1000,
    amount: '£200',
    status: 'Paid',
    date: '2024-04-18',
  },
  {
    id: '5',
    tradesmanName: 'Devon Lane',
    company: 'Lane Carpentry',
    packageName: 'Professional',
    tokens: 500,
    amount: '£120',
    status: 'Paid',
    date: '2024-04-16',
  },
  {
    id: '6',
    tradesmanName: 'Eleanor Pena',
    company: 'Pena Painting Co.',
    packageName: 'Starter',
    tokens: 100,
    amount: '£30',
    status: 'Paid',
    date: '2024-04-14',
  },
  {
    id: '7',
    tradesmanName: 'Ronald Richards',
    company: 'Richards Heating',
    packageName: 'Business',
    tokens: 1000,
    amount: '£200',
    status: 'Paid',
    date: '2024-04-12',
  },
  {
    id: '8',
    tradesmanName: 'Esther Howard',
    company: 'Howard Cleaning',
    packageName: 'Professional',
    tokens: 500,
    amount: '£120',
    status: 'Paid',
    date: '2024-04-10',
  },
  {
    id: '9',
    tradesmanName: 'Robert Fox',
    company: 'Fox Garden Services',
    packageName: 'Starter',
    tokens: 100,
    amount: '£30',
    status: 'Paid',
    date: '2024-04-08',
  },
  {
    id: '10',
    tradesmanName: "Connor O'Brien",
    company: 'BuildRight Plumbing',
    packageName: 'Professional',
    tokens: 500,
    amount: '£120',
    status: 'Paid',
    date: '2024-04-06',
  },
  {
    id: '11',
    tradesmanName: 'Annette Black',
    company: 'Black Electrical Ltd',
    packageName: 'Business',
    tokens: 1000,
    amount: '£200',
    status: 'Paid',
    date: '2024-04-04',
  },
  {
    id: '12',
    tradesmanName: 'Daniel Hughes',
    company: 'DH Rewires',
    packageName: 'Professional',
    tokens: 500,
    amount: '£120',
    status: 'Paid',
    date: '2024-04-02',
  },
]

export function createPackageId(name, existingIds = []) {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  if (!base) return `package-${Date.now()}`

  let candidate = base
  let index = 2

  while (existingIds.includes(candidate)) {
    candidate = `${base}-${index}`
    index += 1
  }

  return candidate
}

export function formatTokenRate(price, tokens) {
  const numericPrice = Number(String(price).replace(/[^\d.]/g, ''))
  if (!numericPrice || !tokens) return '—'
  return `£${(numericPrice / tokens).toFixed(2)} per token`
}

export function formatBudgetAmount(value) {
  if (value === null || value === undefined || value === '') return '—'
  return `£${Number(value).toLocaleString()}`
}

export function createRuleId(label, existingIds = []) {
  return createPackageId(label, existingIds)
}
