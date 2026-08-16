import { ChevronLeft, ChevronRight, Flame, MapPin } from 'lucide-react'
import { useRef } from 'react'
import { useNavigate } from 'react-router'
import { cn } from '@/helpers/cn'

const URGENCY_STYLES = {
  high: 'bg-[#FEF3C7] text-[#D97706]',
  medium: 'bg-[#EFF6FF] text-[#2563EB]',
  low: 'bg-[#ECFDF5] text-[#059669]',
}

function SimilarJobCard({ job, onViewLead }) {
  return (
    <article className="w-[260px] shrink-0 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white sm:w-[280px]">
      <div className="aspect-[4/3] overflow-hidden">
        <img src={job.image} alt={job.title} className="size-full object-cover" />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
              URGENCY_STYLES[job.urgencyVariant] ?? URGENCY_STYLES.medium,
            )}
          >
            {job.urgencyVariant === 'high' ? <Flame className="size-3" /> : null}
            {job.urgency}
          </span>
          <span className="text-xs text-[var(--secondary-text)]">{job.postedAt}</span>
        </div>

        <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-5 text-[var(--primary-text)]">
          {job.title}
        </h3>

        <p className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--secondary-text)]">
          <MapPin className="size-3.5 shrink-0 text-[#EF4444]" />
          {job.location} · {job.distance}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#F1F5F9] pt-4">
          <p className="text-sm font-bold text-[var(--primary-text)]">{job.priceRange}</p>
          <button
            type="button"
            onClick={() => onViewLead(job.id)}
            className="text-sm font-semibold text-btn-primary transition-colors hover:text-[#0150CC]"
          >
            Lead {job.leadCost}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function SimilarJobsNearYou({ jobs }) {
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  const scroll = (direction) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: direction * 300, behavior: 'smooth' })
  }

  return (
    <section className="mt-10 lg:mt-14">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--secondary-text)]">
          Similar Jobs Near You
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Scroll similar jobs left"
            className="inline-flex size-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[var(--secondary-text)] transition-colors hover:border-btn-primary hover:text-btn-primary"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Scroll similar jobs right"
            className="inline-flex size-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[var(--secondary-text)] transition-colors hover:border-btn-primary hover:text-btn-primary"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="mt-6 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {jobs.map((job) => (
          <SimilarJobCard key={job.id} job={job} onViewLead={(id) => navigate(`/jobs/${id}`)} />
        ))}
      </div>
    </section>
  )
}
