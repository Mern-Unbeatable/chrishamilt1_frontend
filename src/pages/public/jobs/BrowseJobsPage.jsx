import { useEffect, useMemo, useState } from 'react'
import {
  DEMO_BROWSE_BUDGETS,
  DEMO_BROWSE_JOB_CATEGORIES,
  DEMO_BROWSE_JOBS,
} from '@/data/demoData'
import BrowseJobsHero from '@/pages/public/jobs/sections/BrowseJobsHero'
import BrowseJobsResults from '@/pages/public/jobs/sections/BrowseJobsResults'

const PAGE_SIZE = 6

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

function filterByHeroFilters(jobs, category, location, budget) {
  const query = location.trim().toLowerCase()

  return jobs.filter((job) => {
    const categoryMatch =
      category === DEMO_BROWSE_JOB_CATEGORIES[0] || job.category === category
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
  const [category, setCategory] = useState(DEMO_BROWSE_JOB_CATEGORIES[0])
  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState(DEMO_BROWSE_BUDGETS[0])
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)

  const heroFilteredJobs = useMemo(
    () => filterByHeroFilters(DEMO_BROWSE_JOBS, category, location, budget),
    [category, location, budget],
  )

  const filteredJobs = useMemo(
    () => filterByKeyword(heroFilteredJobs, keyword),
    [heroFilteredJobs, keyword],
  )

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE))

  const paginatedJobs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredJobs.slice(start, start + PAGE_SIZE)
  }, [filteredJobs, page])

  useEffect(() => {
    setPage(1)
  }, [category, location, budget, keyword])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  return (
    <>
      <BrowseJobsHero
        category={category}
        onCategoryChange={setCategory}
        location={location}
        onLocationChange={setLocation}
        budget={budget}
        onBudgetChange={setBudget}
        filteredCount={heroFilteredJobs.length}
      />
      <BrowseJobsResults
        jobs={paginatedJobs}
        totalCount={filteredJobs.length}
        keyword={keyword}
        onKeywordChange={setKeyword}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  )
}
