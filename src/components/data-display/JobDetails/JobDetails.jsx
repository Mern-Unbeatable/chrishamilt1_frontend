import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronDown,
  Flag,
  MapPin,
  MessageCircle,
  Star,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/helpers/cn'

const STATUS_STYLES = {
  completed: 'bg-[#ECFDF5] text-[#059669]',
  open: 'bg-[#EFF6FF] text-[#2563EB]',
  inProgress: 'bg-[#FFF7ED] text-[#EA580C]',
  cancelled: 'bg-[#FEF2F2] text-[#DC2626]',
}

function RatingStars({ rating }) {
  const fullStars = Math.floor(rating)

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            'size-4',
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

/**
 * Common job details page — prop-driven, no internal navigation.
 * Pass onMessage from the parent page; omit to hide the message button.
 */
export default function JobDetails({
  job,
  showSummary = true,
  showTradesman = true,
  showGallery = true,
  onMessage,
  messageLabel = 'Message',
  className = '',
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)

  const {
    status,
    statusVariant = 'open',
    title,
    location,
    price,
    tradesman,
    description,
    requirements = [],
    preferredStart,
    completionBy,
    specialNotes,
    photos = [],
  } = job

  const displayText = isExpanded ? description.full : description.summary
  const activePhoto = photos[activePhotoIndex]
  const messageButtonClassName =
    'inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-btn-primary transition-colors hover:bg-[#DCE9FD] sm:w-auto'

  return (
    <div className={cn('space-y-6', className)}>
      {showSummary ? (
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-6 lg:p-8">
          <span
            className={cn(
              'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
              STATUS_STYLES[statusVariant] ?? STATUS_STYLES.open,
            )}
          >
            {status}
          </span>

          <h1 className="mt-4 text-2xl font-bold tracking-[-0.02em] text-(--primary-text) sm:text-3xl">
            {title}
          </h1>

          <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-(--secondary-text)">
            <MapPin className="size-4 shrink-0" />
            {location}
          </p>

          <p className="mt-6 text-2xl font-bold text-(--primary-text)">{price}</p>
        </section>
      ) : null}

      {showTradesman && tradesman ? (
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-6 lg:p-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-(--secondary-text)">
            Tradesman Information
          </h2>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              {tradesman.avatar ? (
                <img
                  src={tradesman.avatar}
                  alt={tradesman.name}
                  className="size-16 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-semibold text-btn-primary">
                  {tradesman.initials}
                </div>
              )}

              <div className="min-w-0">
                <p className="text-lg font-semibold text-(--primary-text)">
                  {tradesman.name}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <RatingStars rating={tradesman.rating} />
                  <span className="text-sm text-(--secondary-text)">
                    {tradesman.rating} ({tradesman.reviewCount})
                  </span>
                  <span className="text-sm text-(--secondary-text)">
                    {tradesman.jobsCompleted} jobs • {tradesman.yearsExperience} yrs exp.
                  </span>
                </div>

                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-(--secondary-text)">
                  <MapPin className="size-4 shrink-0" />
                  {tradesman.location}
                </p>
              </div>
            </div>

            {onMessage ? (
              <button type="button" onClick={onMessage} className={messageButtonClassName}>
                <MessageCircle className="size-4" />
                {messageLabel}
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:items-start">
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-6 lg:p-8">
          <h2 className="text-xs lg:text-sm font-semibold uppercase tracking-[0.12em] text-(--secondary-text)">
            Job Description
          </h2>

          <div className="mt-5">
            <p className="whitespace-pre-line text-sm lg:text-base leading-7 text-(--secondary-text)">
              {displayText}
            </p>

            {description.full !== description.summary ? (
              <button
                type="button"
                onClick={() => setIsExpanded((current) => !current)}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-btn-primary hover:underline"
              >
                <ChevronDown
                  className={cn('size-4 transition-transform', isExpanded && 'rotate-180')}
                />
                {isExpanded ? 'Show less' : 'Read full description'}
              </button>
            ) : null}
          </div>

          {requirements.length > 0 ? (
            <div className="mt-8">
              <h3 className="text-base font-semibold text-(--primary-text)">
                Requirements
              </h3>
              <ul className="mt-4 space-y-3">
                {requirements.map((item) => (
                  <li key={item} className="flex gap-3 text-sm lg:text-base leading-6 text-(--secondary-text)">
                    <Check className="mt-0.5 size-4 shrink-0 text-btn-primary" strokeWidth={2.5} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[#F8FAFC] p-4">
              <p className="inline-flex items-center gap-2 text-xs font-medium text-(--secondary-text)">
                <CalendarDays className="size-4" />
                Preferred Start
              </p>
              <p className="mt-2 text-sm font-semibold text-(--primary-text)">
                {preferredStart}
              </p>
            </div>

            <div className="rounded-xl bg-[#F8FAFC] p-4">
              <p className="inline-flex items-center gap-2 text-xs font-medium text-(--secondary-text)">
                <Flag className="size-4" />
                Completion By
              </p>
              <p className="mt-2 text-sm font-semibold text-(--primary-text)">
                {completionBy}
              </p>
            </div>
          </div>

          {specialNotes ? (
            <div className="mt-6 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#B45309]">
                <AlertTriangle className="size-4" />
                Special Notes
              </p>
              <p className="mt-2 text-sm leading-6 text-[#92400E]">{specialNotes}</p>
            </div>
          ) : null}
        </section>

        {showGallery && photos.length > 0 ? (
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-6 lg:p-8 xl:self-start">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-(--secondary-text)">
                Photo Gallery
              </h2>
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#94A3B8]">
                {photos.length} Photos
              </span>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl">
              <img
                src={activePhoto.src}
                alt={activePhoto.alt}
                className="aspect-4/3 w-full object-cover"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
              {photos.map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => setActivePhotoIndex(index)}
                  className={cn(
                    'size-16 overflow-hidden rounded-lg border-2 transition-colors sm:size-18',
                    activePhotoIndex === index ? 'border-btn-primary' : 'border-transparent',
                  )}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
