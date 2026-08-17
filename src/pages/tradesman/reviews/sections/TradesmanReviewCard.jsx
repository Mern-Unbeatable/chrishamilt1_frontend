import { Star } from 'lucide-react'
import { cn } from '@/helpers/cn'

export function RatingStars({ rating, size = 'md', className = '' }) {
  const fullStars = Math.floor(rating)
  const sizeClass = size === 'sm' ? 'size-3.5' : size === 'lg' ? 'size-5' : 'size-4'

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            sizeClass,
            index < fullStars
              ? 'fill-[#FBBF24] text-[#FBBF24]'
              : 'fill-[#E5E7EB] text-[#E5E7EB]',
          )}
          strokeWidth={0}
        />
      ))}
    </div>
  )
}

export default function TradesmanReviewCard({ name, initials, rating, jobTitle, date, text }) {
  return (
    <article className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#EAF2FE] text-sm font-bold text-btn-primary sm:size-12">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-[#111827]">{name}</h3>
              <div className="mt-1">
                <RatingStars rating={rating} size="sm" />
              </div>
              <p className="mt-1 text-sm text-[#64748B]">{jobTitle}</p>
            </div>
            <time className="shrink-0 text-xs font-medium text-[#94A3B8] sm:text-sm">{date}</time>
          </div>

          <p className="mt-4 text-sm leading-6 text-[#111827]">{text}</p>
        </div>
      </div>
    </article>
  )
}
