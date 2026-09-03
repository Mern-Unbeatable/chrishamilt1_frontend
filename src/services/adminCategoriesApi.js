import { apiRequest } from '@/auth/apiClient'
import { getAccessToken } from '@/auth/authService'
import { AUTH_CONFIG } from '@/auth/authConfig'
import { DEFAULT_TRADE_CATEGORIES } from '@/data/categoriesData'

const FALLBACK_ICONS_BY_SLUG = Object.fromEntries(
  DEFAULT_TRADE_CATEGORIES.map((category) => [category.id, category.icon]),
)

export function isCategoriesApiEnabled() {
  return Boolean(AUTH_CONFIG.apiBaseUrl)
}

export function isAdminCategoriesApiEnabled() {
  return isCategoriesApiEnabled()
}

function getCategoryIcon(category) {
  if (category.icon) return category.icon

  const slug = category.slug ?? ''
  return FALLBACK_ICONS_BY_SLUG[slug] ?? 'wrench'
}

export function mapApiCategoryToAdmin(category) {
  return {
    id: category.id,
    slug: category.slug ?? category.id,
    name: category.name,
    icon: getCategoryIcon(category),
    jobs: category._count?.jobs ?? 0,
  }
}

export function mapApiCategoryToBrowseTrade(category) {
  return mapApiCategoryToAdmin(category)
}

export function toApiCategoryIcon(icon = '') {
  return icon.trim().toLowerCase()
}

export async function fetchAdminCategories() {
  const payload = await apiRequest('/api/categories')
  const items = payload?.data ?? payload ?? []

  if (!Array.isArray(items)) {
    return []
  }

  return items.map(mapApiCategoryToAdmin)
}

export async function fetchBrowseTradeCategories() {
  const payload = await apiRequest('/api/categories')
  const items = payload?.data ?? payload ?? []

  if (!Array.isArray(items)) {
    return []
  }

  return items.map(mapApiCategoryToBrowseTrade)
}

export async function createAdminCategory({ name, icon }) {
  const trimmedName = name?.trim()
  const trimmedIcon = toApiCategoryIcon(icon)

  if (!trimmedName) {
    throw new Error('Category name is required.')
  }

  if (!trimmedIcon) {
    throw new Error('Category icon is required.')
  }

  const payload = await apiRequest('/api/categories', {
    method: 'POST',
    body: {
      name: trimmedName,
      icon: trimmedIcon,
    },
    token: getAccessToken(),
  })

  const category = payload?.data ?? payload
  return category ? mapApiCategoryToAdmin(category) : null
}

export async function deleteAdminCategory(categoryId) {
  if (!categoryId) {
    throw new Error('Category not found.')
  }

  await apiRequest(`/api/categories/${encodeURIComponent(categoryId)}`, {
    method: 'DELETE',
    token: getAccessToken(),
  })
}
