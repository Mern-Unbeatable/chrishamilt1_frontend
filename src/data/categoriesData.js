export const TRADE_CATEGORIES_STORAGE_KEY = 'tradetrust.tradeCategories'

export const DEFAULT_TRADE_CATEGORIES = [
  { id: 'plumbing', name: 'Plumbing', icon: 'Droplets', jobs: 234 },
  { id: 'electrical', name: 'Electrical', icon: 'Zap', jobs: 189 },
  { id: 'roofing', name: 'Roofing', icon: 'Home', jobs: 156 },
  { id: 'carpentry', name: 'Carpentry', icon: 'Hammer', jobs: 143 },
  { id: 'painting', name: 'Painting', icon: 'Paintbrush', jobs: 211 },
  { id: 'cleaning', name: 'Cleaning', icon: 'Sparkles', jobs: 178 },
  { id: 'gardening', name: 'Gardening', icon: 'Leaf', jobs: 165 },
  { id: 'handyman', name: 'Handyman', icon: 'Wrench', jobs: 298 },
  { id: 'flooring', name: 'Flooring', icon: 'Grid2x2', jobs: 127 },
  { id: 'heating', name: 'Heating', icon: 'Flame', jobs: 193 },
  { id: 'building', name: 'Building', icon: 'Building2', jobs: 89 },
  { id: 'renovation', name: 'Renovation', icon: 'Sun', jobs: 76 },
  { id: 'tiling', name: 'Tiling', icon: 'Grid3x3', jobs: 134 },
  { id: 'flat-pack', name: 'Flat Pack', icon: 'Box', jobs: 203 },
]

export function createCategoryId(name, existingIds = []) {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  if (!base) return `category-${Date.now()}`

  let candidate = base
  let index = 2

  while (existingIds.includes(candidate)) {
    candidate = `${base}-${index}`
    index += 1
  }

  return candidate
}

export function loadTradeCategories() {
  if (typeof window === 'undefined') return DEFAULT_TRADE_CATEGORIES

  try {
    const stored = window.localStorage.getItem(TRADE_CATEGORIES_STORAGE_KEY)
    if (!stored) return DEFAULT_TRADE_CATEGORIES

    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TRADE_CATEGORIES
  } catch {
    return DEFAULT_TRADE_CATEGORIES
  }
}

export function saveTradeCategories(categories) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(TRADE_CATEGORIES_STORAGE_KEY, JSON.stringify(categories))
}
