import { Star } from 'lucide-react'

export default function TestimonialCard({
  quote,
  name,
  location,
  service,
  initials,
  rating = 5,
}) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-[#E5E7EB] bg-white p-8">
      <div className="flex gap-0.5">
        {Array.from({ length: rating }).map((_, index) => (
          <Star
            key={index}
            className="size-4 fill-[#FBBF24] text-[#FBBF24]"
            strokeWidth={0}
          />
        ))}
      </div>
      <blockquote className="mt-5 flex-1 text-base italic text-gray-500 font-semibold">
        &ldquo;{quote}&rdquo;
      </blockquote>

      <div className="mt-8 flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-btn-primary">
          {initials}
        </div>

        <div>
          <p className="text-sm font-semibold text-[#111827]">{name}</p>
          <p className="text-xs text-[#64748B]">
            {location} · {service}
          </p>
        </div>
      </div>
    </article>
  )
}
