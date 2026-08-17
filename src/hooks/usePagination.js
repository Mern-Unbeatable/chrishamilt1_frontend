import { useEffect, useMemo, useState } from 'react'

export function usePagination(items, pageSize = 3) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, page, pageSize])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  return {
    page,
    setPage,
    totalPages,
    paginatedItems,
  }
}
