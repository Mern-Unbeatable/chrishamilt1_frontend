import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  createCategoryId,
  DEFAULT_TRADE_CATEGORIES,
  loadTradeCategories,
  saveTradeCategories,
} from '@/data/categoriesData'

const TradeCategoriesContext = createContext(null)

export function TradeCategoriesProvider({ children }) {
  const [categories, setCategories] = useState(() => loadTradeCategories())

  const persist = useCallback((nextCategories) => {
    setCategories(nextCategories)
    saveTradeCategories(nextCategories)
  }, [])

  const addCategory = useCallback(
    ({ name, icon }) => {
      const trimmedName = name.trim()
      if (!trimmedName || !icon) return { ok: false, error: 'Name and icon are required.' }

      const duplicate = categories.some(
        (category) => category.name.toLowerCase() === trimmedName.toLowerCase(),
      )

      if (duplicate) {
        return { ok: false, error: 'A category with this name already exists.' }
      }

      const nextCategory = {
        id: createCategoryId(
          trimmedName,
          categories.map((category) => category.id),
        ),
        name: trimmedName,
        icon,
        jobs: 0,
      }

      persist([...categories, nextCategory])
      return { ok: true, category: nextCategory }
    },
    [categories, persist],
  )

  const removeCategory = useCallback(
    (categoryId) => {
      persist(categories.filter((category) => category.id !== categoryId))
    },
    [categories, persist],
  )

  const resetCategories = useCallback(() => {
    persist(DEFAULT_TRADE_CATEGORIES)
  }, [persist])

  const value = useMemo(
    () => ({
      categories,
      addCategory,
      removeCategory,
      resetCategories,
    }),
    [categories, addCategory, removeCategory, resetCategories],
  )

  return (
    <TradeCategoriesContext.Provider value={value}>
      {children}
    </TradeCategoriesContext.Provider>
  )
}

export function useTradeCategories() {
  const context = useContext(TradeCategoriesContext)

  if (!context) {
    throw new Error('useTradeCategories must be used within TradeCategoriesProvider')
  }

  return context
}
