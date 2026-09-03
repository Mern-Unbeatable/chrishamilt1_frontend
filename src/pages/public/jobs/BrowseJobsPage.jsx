import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import {
  DEMO_BROWSE_BUDGETS,
  DEMO_BROWSE_JOB_CATEGORIES,
  DEMO_BROWSE_JOBS,
} from '@/data/demoData'
import useDebouncedValue from '@/hooks/useDebouncedValue'
import BrowseJobsHero from '@/pages/public/jobs/sections/BrowseJobsHero'
import BrowseJobsResults from '@/pages/public/jobs/sections/BrowseJobsResults'
import {
  ALL_CATEGORIES_OPTION,
  fetchJobCategories,
  fetchPublicJobs,
  getFallbackJobCategories,
  isPublicJobsApiEnabled,
  PUBLIC_JOBS_PAGE_SIZE,
} from '@/services/publicJobsApi'

const PAGE_SIZE = PUBLIC_JOBS_PAGE_SIZE

function parsePriceRange(priceRange = '') {
  const values = priceRange.match(/\d[\d,]*/g)?.map((value) => Number(value.replace(/,/g, ''))) || []

  return {
    min: values[0] ?? 0,
    max: values[1] ?? values[0] ?? 0,
  }
}

function matchesBudget(priceRange, budget) {
  if (budget === DEMO_BROWSE_BUDGETS[0]) return true

  const { min, max } = parsePriceRange(priceRange)

  if (budget === 'Under £1,000') return max < 1000
  if (budget === '£1,000–£5,000') return max >= 1000 && min <= 5000
  if (budget === '£5,000–£10,000') return max >= 5000 && min <= 10000
  if (budget === '£10,000+') return min >= 10000

  return true
}

function filterByHeroFilters(jobs, categoryLabel, location, budget) {
  const query = location.trim().toLowerCase()

  return jobs.filter((job) => {
    const categoryMatch =
      categoryLabel === DEMO_BROWSE_JOB_CATEGORIES[0] || job.category === categoryLabel
    const locationMatch = !query || job.location.toLowerCase().includes(query)
    const budgetMatch = matchesBudget(job.priceRange, budget)

    return categoryMatch && locationMatch && budgetMatch
  })
}

function filterByKeyword(jobs, keyword) {
  const query = keyword.trim().toLowerCase()
  if (!query) return jobs

  return jobs.filter((job) => {
    const haystack = `${job.title} ${job.location} ${job.category}`.toLowerCase()
    return haystack.includes(query)
  })
}

export default function BrowseJobsPage() {
  const useApi = isPublicJobsApiEnabled()
  const [searchParams] = useSearchParams()
  const initialCategorySlug = searchParams.get('category')?.trim() ?? ''

  const [categories, setCategories] = useState(() =>
    useApi ? getFallbackJobCategories() : DEMO_BROWSE_JOB_CATEGORIES.map((label) => ({ label, slug: label === DEMO_BROWSE_JOB_CATEGORIES[0] ? '' : label })),
  )
  const [categorySlug, setCategorySlug] = useState(initialCategorySlug)
  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState(DEMO_BROWSE_BUDGETS[0])
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)

  const [jobs, setJobs] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(useApi)
  const [error, setError] = useState('')

  const debouncedKeyword = useDebouncedValue(keyword, 400)
  const debouncedLocation = useDebouncedValue(location, 400)

  const selectedCategory =
    categories.find((item) => item.slug === categorySlug) ?? categories[0] ?? ALL_CATEGORIES_OPTION

  const demoHeroFilteredJobs = useMemo(
    () =>
      filterByHeroFilters(
        DEMO_BROWSE_JOBS,
        selectedCategory.label,
        location,
        budget,
      ),
    [selectedCategory.label, location, budget],
  )

  const demoFilteredJobs = useMemo(
    () => filterByKeyword(demoHeroFilteredJobs, keyword),
    [demoHeroFilteredJobs, keyword],
  )

  const demoPaginatedJobs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return demoFilteredJobs.slice(start, start + PAGE_SIZE)
  }, [demoFilteredJobs, page])

  useEffect(() => {
    if (!useApi) return undefined

    let cancelled = false

    fetchJobCategories()
      .then((nextCategories) => {
        if (!cancelled) setCategories(nextCategories)
      })
      .catch(() => {
        if (!cancelled) setCategories(getFallbackJobCategories())
      })

    return () => {
      cancelled = true
    }
  }, [useApi])

  useEffect(() => {
    const nextSlug = searchParams.get('category')?.trim() ?? ''
    setCategorySlug(nextSlug)
    setPage(1)
  }, [searchParams])

  useEffect(() => {
    setPage(1)
  }, [categorySlug, debouncedLocation, budget, debouncedKeyword])

  useEffect(() => {
    if (!useApi) return undefined

    let cancelled = false

    async function loadJobs() {
      setLoading(true)
      setError('')

      try {
        const result = await fetchPublicJobs({
          categorySlug,
          location: debouncedLocation,
          search: debouncedKeyword,
          budgetLabel: budget,
          page,
          limit: PAGE_SIZE,
        })

        if (cancelled) return

        setJobs(result.jobs)
        setTotalCount(result.pagination.total ?? result.jobs.length)
        setTotalPages(Math.max(1, result.pagination.totalPages ?? 1))
      } catch (err) {
        if (cancelled) return

        setJobs([])
        setTotalCount(0)
        setTotalPages(1)
        setError(err?.message || 'Unable to load jobs right now.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadJobs()

    return () => {
      cancelled = true
    }
  }, [useApi, categorySlug, debouncedLocation, debouncedKeyword, budget, page])

  useEffect(() => {
    if (useApi) return
    const nextTotalPages = Math.max(1, Math.ceil(demoFilteredJobs.length / PAGE_SIZE))
    if (page > nextTotalPages) setPage(nextTotalPages)
  }, [useApi, demoFilteredJobs.length, page])

  const displayJobs = useApi ? jobs : demoPaginatedJobs
  const displayTotalCount = useApi ? totalCount : demoFilteredJobs.length
  const displayTotalPages = useApi ? totalPages : Math.max(1, Math.ceil(demoFilteredJobs.length / PAGE_SIZE))
  const heroFilteredCount = useApi ? totalCount : demoHeroFilteredJobs.length

  return (
    <>
      <BrowseJobsHero
        categories={categories}
        categoryLabel={selectedCategory.label}
        onCategoryChange={setCategorySlug}
        location={location}
        onLocationChange={setLocation}
        budget={budget}
        onBudgetChange={setBudget}
        filteredCount={heroFilteredCount}
      />
      <BrowseJobsResults
        jobs={displayJobs}
        totalCount={displayTotalCount}
        keyword={keyword}
        onKeywordChange={setKeyword}
        page={page}
        totalPages={displayTotalPages}
        onPageChange={setPage}
        loading={useApi && loading}
        error={useApi ? error : ''}
      />
    </>
  )
}
