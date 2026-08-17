import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'

export default function BookingDetailsBreadcrumbs() {
  const crumbs = [
    { label: 'My Booking', to: '/my-bookings' },
    { label: 'order details' },
  ]

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--secondary-text)]">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1

          return (
            <li key={crumb.label} className="inline-flex items-center gap-1.5">
              {index > 0 ? <ChevronRight className="size-3.5 shrink-0 text-[#CBD5E1]" /> : null}
              {crumb.to && !isLast ? (
                <Link to={crumb.to} className="transition-colors hover:text-btn-primary">
                  {crumb.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-medium text-[var(--primary-text)]' : undefined}>
                  {crumb.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
