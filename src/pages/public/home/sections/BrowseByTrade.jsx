import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import TradeIcon from '@/components/common/TradeIcon'
import { DEFAULT_TRADE_CATEGORIES } from '@/data/categoriesData'
import {
  fetchBrowseTradeCategories,
  isCategoriesApiEnabled,
} from '@/services/adminCategoriesApi'

const FALLBACK_CATEGORIES = DEFAULT_TRADE_CATEGORIES.slice(0, 14).map((trade) => ({
  id: trade.id,
  slug: trade.id,
  name: trade.name,
  icon: trade.icon,
  jobs: trade.jobs,
}))

export default function BrowseByTrade() {
  const useApi = isCategoriesApiEnabled()
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES)
  const [loading, setLoading] = useState(useApi)

  useEffect(() => {
    if (!useApi) return undefined

    let cancelled = false

    async function loadCategories() {
      setLoading(true)

      try {
        const nextCategories = await fetchBrowseTradeCategories()
        if (!cancelled && nextCategories.length) {
          setCategories(nextCategories)
        }
      } catch {
        if (!cancelled) setCategories(FALLBACK_CATEGORIES)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadCategories()

    return () => {
      cancelled = true
    }
  }, [useApi])

  return (
    <section
      id="categories"
      data-scroll-section
      className="scroll-mt-[88px] bg-white pb-20 pt-4 lg:pb-24"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div data-scroll-header className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-[#111827] sm:text-4xl">
            Browse by Trade
          </h2>
          <p className="mt-4 text-base text-[#64748B] sm:text-lg">
            Find the right specialist for your project
          </p>
        </div>

        {loading ? (
          <div className="mt-12 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-6 py-12 text-center">
            <p className="text-sm text-[#64748B]">Loading trade categories…</p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {categories.map((trade) => (
              <Link
                key={trade.id}
                data-scroll-item
                to={trade.slug ? `/jobs?category=${encodeURIComponent(trade.slug)}` : '/jobs'}
                className="flex flex-col items-center rounded-xl bg-primary px-4 py-6 text-center transition-colors hover:bg-[#DCE9FD]"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-btn-primary text-white">
                  <TradeIcon name={trade.icon} className="size-5" strokeWidth={2} />
                </span>
                <span className="mt-4 text-sm font-semibold text-[#111827]">
                  {trade.name}
                </span>
                <span className="mt-1 text-xs text-[#64748B]">
                  {trade.jobs} {trade.jobs === 1 ? 'job' : 'jobs'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
