import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  CloudUpload,
  FileText,
  Image,
  Video,
  X,
} from 'lucide-react'
import { cn } from '@/helpers/cn'

const TOTAL_STEPS = 5

const STEP_TITLES = {
  1: 'Quote Details',
  2: 'Write Your Proposal',
  3: 'Attachments',
  4: 'Review & Submit',
  5: 'Quote Submitted',
}

const PROPOSAL_SNIPPETS = [
  { label: 'Introduce yourself', text: "Hi, my name is [Your Name] and I'm a qualified tradesman with extensive experience in projects like yours." },
  { label: 'Explain timeline', text: 'I can start within your preferred window and will provide a clear day-by-day schedule before work begins.' },
  { label: 'Mention materials', text: 'All plumbing fittings, adhesive, and grout can be supplied, or we can work with materials you have already purchased.' },
  { label: 'Add guarantee', text: 'I include a 12-month labour guarantee on all work completed.' },
  { label: 'Call to action', text: 'I would be happy to visit for a free assessment — please let me know a convenient time.' },
]

const ATTACHMENT_TYPES = [
  { id: 'portfolio', label: 'Portfolio PDF', description: 'Previous work samples', icon: FileText, tone: 'text-[#2563EB]' },
  { id: 'photos', label: 'Job Photos', description: 'Similar past projects', icon: Image, tone: 'text-[#059669]' },
  { id: 'certificates', label: 'Certificates', description: 'Qualifications & accreditation', icon: Award, tone: 'text-[#D97706]' },
  { id: 'video', label: 'Video', description: 'Intro or previous work', icon: Video, tone: 'text-[#7C3AED]' },
]

const DEFAULT_PROPOSAL =
  "Hi Sarah,\n\nMy name is [Your Name] and I'm a qualified plumber with over 8 years of experience in full bathroom renovations. I've reviewed your project brief and I'm confident I can deliver exactly what you're looking for.\n\nMy approach would be to start with a full strip-out and waste rerouting, then install the new suite before tiling all surfaces. I work cleanly and always leave the site tidy at the end of each day.\n\nLooking forward to hearing from you!"

function StepProgress({ step }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      {Array.from({ length: TOTAL_STEPS }).map((_, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === step
        const isComplete = stepNumber < step

        return (
          <span
            key={stepNumber}
            className={cn(
              'h-1 rounded-full transition-all',
              isActive ? 'w-8 bg-btn-primary' : 'w-4',
              isComplete ? 'bg-btn-primary/60' : !isActive ? 'bg-[#E5E7EB]' : null,
            )}
          />
        )
      })}
    </div>
  )
}

function FieldLabel({ children, required = false }) {
  return (
    <label className="text-sm font-semibold text-[#111827]">
      {children}
      {required ? <span className="text-[#DC2626]"> *</span> : null}
    </label>
  )
}

function TextInput({ className = '', ...props }) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15',
        className,
      )}
      {...props}
    />
  )
}

function QuoteDetailsStep({ form, onChange, customerBudget }) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel required>Quote Amount (£)</FieldLabel>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm font-medium text-[#64748B]">
            £
          </span>
          <TextInput
            type="number"
            min="0"
            step="1"
            value={form.quoteAmount}
            onChange={(event) => onChange('quoteAmount', event.target.value)}
            className="pl-8"
            placeholder="2,800"
          />
        </div>
        {customerBudget ? (
          <p className="mt-2 text-xs text-[#64748B]">Customer budget: {customerBudget}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel required>Estimated Duration</FieldLabel>
          <TextInput
            value={form.duration}
            onChange={(event) => onChange('duration', event.target.value)}
            placeholder="e.g. 2–3 weeks"
            className="mt-2"
          />
        </div>

        <div>
          <FieldLabel required>Available Start Date</FieldLabel>
          <TextInput
            type="date"
            value={form.startDate}
            onChange={(event) => onChange('startDate', event.target.value)}
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <FieldLabel required>Materials Included?</FieldLabel>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { value: true, label: 'Yes, included' },
            { value: false, label: 'No, extra' },
          ].map((option) => (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange('materialsIncluded', option.value)}
              className={cn(
                'inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors',
                form.materialsIncluded === option.value
                  ? 'border-btn-primary bg-[#EFF6FF] text-btn-primary'
                  : 'border-[#E5E7EB] bg-white text-[#64748B] hover:bg-[#F8FAFC]',
              )}
            >
              {form.materialsIncluded === option.value ? (
                <Check className="size-4 shrink-0" strokeWidth={2.25} />
              ) : (
                <X className="size-4 shrink-0" strokeWidth={2} />
              )}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Warranty / Guarantee (optional)</FieldLabel>
        <TextInput
          value={form.warranty}
          onChange={(event) => onChange('warranty', event.target.value)}
          placeholder="e.g. 12-month labour guarantee"
          className="mt-2"
        />
      </div>
    </div>
  )
}

function ProposalStep({ form, onChange }) {
  const charCount = form.proposal.length
  const showLengthWarning = charCount > 0 && charCount < 100

  const appendSnippet = (text) => {
    const separator = form.proposal.trim() ? '\n\n' : ''
    onChange('proposal', `${form.proposal}${separator}${text}`)
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3">
        <p className="text-sm leading-6 text-[#1E40AF]">
          <span className="font-semibold">Pro tip:</span> Introduce yourself, highlight your
          experience, explain your approach, and add a call to action. Quotes with 150+ words get
          3x more responses.
        </p>
      </div>

      <div>
        <FieldLabel required>Your Proposal</FieldLabel>
        <textarea
          value={form.proposal}
          onChange={(event) => onChange('proposal', event.target.value)}
          rows={8}
          maxLength={1000}
          placeholder="Write your proposal to the customer..."
          className="mt-2 w-full resize-y rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm leading-6 text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className={cn('text-xs', showLengthWarning ? 'text-[#DC2626]' : 'text-[#64748B]')}>
            {showLengthWarning
              ? 'Write at least 100 characters for best results.'
              : `${charCount}/1000 characters`}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {PROPOSAL_SNIPPETS.map((snippet) => (
          <button
            key={snippet.label}
            type="button"
            onClick={() => appendSnippet(snippet.text)}
            className="inline-flex rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#64748B] transition-colors hover:border-[#CBD5E1] hover:text-[#111827]"
          >
            {snippet.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function AttachmentsStep({ selectedTypes, onToggleType }) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border-2 border-dashed border-[#BFDBFE] bg-[#F8FAFC] px-6 py-10 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#EFF6FF] text-btn-primary">
          <CloudUpload className="size-6" strokeWidth={1.75} />
        </span>
        <p className="mt-4 text-base font-semibold text-[#111827]">Drag &amp; Drop Files</p>
        <p className="mt-2 text-sm text-[#64748B]">
          PDF, Images, certificates, portfolios, videos. Max 25MB per file.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ATTACHMENT_TYPES.map((type) => {
          const Icon = type.icon
          const isSelected = selectedTypes.includes(type.id)

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onToggleType(type.id)}
              className={cn(
                'rounded-xl border p-4 text-left transition-colors',
                isSelected
                  ? 'border-btn-primary bg-[#EFF6FF]'
                  : 'border-[#E5E7EB] bg-white hover:bg-[#F8FAFC]',
              )}
            >
              <Icon className={cn('size-5', type.tone)} strokeWidth={1.75} />
              <p className="mt-3 text-sm font-semibold text-[#111827]">{type.label}</p>
              <p className="mt-1 text-xs text-[#64748B]">{type.description}</p>
            </button>
          )
        })}
      </div>

      <p className="text-center text-sm text-[#64748B]">
        Attachments are optional but increase win rate by 40%
      </p>
    </div>
  )
}

function ReviewStep({ form, customerBudget }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Quote summary</p>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[#64748B]">Amount</dt>
            <dd className="font-semibold text-[#111827]">£{form.quoteAmount || '—'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#64748B]">Customer budget</dt>
            <dd className="font-semibold text-[#111827]">{customerBudget || '—'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#64748B]">Duration</dt>
            <dd className="font-semibold text-[#111827]">{form.duration || '—'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#64748B]">Start date</dt>
            <dd className="font-semibold text-[#111827]">{form.startDate || '—'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#64748B]">Materials</dt>
            <dd className="font-semibold text-[#111827]">
              {form.materialsIncluded ? 'Included' : 'Extra cost'}
            </dd>
          </div>
          {form.warranty ? (
            <div className="flex justify-between gap-4">
              <dt className="text-[#64748B]">Warranty</dt>
              <dd className="font-semibold text-[#111827]">{form.warranty}</dd>
            </div>
          ) : null}
        </dl>
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Proposal preview</p>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#111827]">
          {form.proposal || 'No proposal entered.'}
        </p>
      </div>
    </div>
  )
}

function SuccessStep({ onViewQuotes }) {
  return (
    <div className="py-6 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#ECFDF5] text-[#059669]">
        <Check className="size-8" strokeWidth={2.25} />
      </span>
      <h3 className="mt-5 text-xl font-bold text-[#111827]">Quote submitted successfully</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#64748B]">
        Your quote has been sent to the customer. You can track its status from My Quotes.
      </p>
      {onViewQuotes ? (
        <button
          type="button"
          onClick={onViewQuotes}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-btn-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC]"
        >
          View My Quotes
        </button>
      ) : null}
    </div>
  )
}

function createInitialForm() {
  return {
    quoteAmount: '2800',
    duration: '2–3 weeks',
    startDate: '2026-08-15',
    materialsIncluded: true,
    warranty: '',
    proposal: DEFAULT_PROPOSAL,
    attachmentTypes: [],
  }
}

export default function SendQuoteModal({
  open,
  onClose,
  jobTitle,
  customerBudget,
  onSubmit,
  onViewQuotes,
}) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(createInitialForm)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setStep(1)
      setForm(createInitialForm())
    }
  }, [open])

  if (!open) return null

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const toggleAttachmentType = (typeId) => {
    setForm((current) => ({
      ...current,
      attachmentTypes: current.attachmentTypes.includes(typeId)
        ? current.attachmentTypes.filter((id) => id !== typeId)
        : [...current.attachmentTypes, typeId],
    }))
  }

  const canContinueStep1 =
    form.quoteAmount.trim() && form.duration.trim() && form.startDate.trim()

  const canContinueStep2 = form.proposal.trim().length >= 100

  const handleContinue = () => {
    if (step === 4) {
      onSubmit?.(form)
      setStep(5)
      return
    }

    if (step < TOTAL_STEPS) {
      setStep((current) => current + 1)
    }
  }

  const handleBack = () => {
    if (step > 1 && step < 5) {
      setStep((current) => current - 1)
    }
  }

  const isSuccessStep = step === 5
  const showBackButton = step > 1 && step < 5
  const primaryLabel =
    step === 1 ? 'Continue' : step === 3 ? 'Submit' : step === 4 ? 'Submit Quote' : null

  const primaryDisabled =
    (step === 1 && !canContinueStep1) ||
    (step === 2 && !canContinueStep2)

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close send quote modal"
        className="absolute inset-0 bg-[#111827]/50"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="send-quote-title"
        className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[88vh] sm:rounded-2xl"
      >
        <div className="border-b border-[#E5E7EB] px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {!isSuccessStep ? (
                <p className="text-xs font-medium text-[#64748B]">Step {step} of {TOTAL_STEPS}</p>
              ) : null}
              <h2 id="send-quote-title" className="mt-1 text-xl font-bold text-[#111827] sm:text-2xl">
                {STEP_TITLES[step]}
              </h2>
              {jobTitle && step < 5 ? (
                <p className="mt-1 truncate text-sm text-[#64748B]">{jobTitle}</p>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {!isSuccessStep ? <StepProgress step={step} /> : null}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex size-9 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#111827]"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {step === 1 ? (
            <QuoteDetailsStep
              form={form}
              onChange={updateField}
              customerBudget={customerBudget}
            />
          ) : null}
          {step === 2 ? <ProposalStep form={form} onChange={updateField} /> : null}
          {step === 3 ? (
            <AttachmentsStep
              selectedTypes={form.attachmentTypes}
              onToggleType={toggleAttachmentType}
            />
          ) : null}
          {step === 4 ? <ReviewStep form={form} customerBudget={customerBudget} /> : null}
          {step === 5 ? <SuccessStep onViewQuotes={onViewQuotes} /> : null}
        </div>

        {!isSuccessStep ? (
          <div className="border-t border-[#E5E7EB] px-5 py-4 sm:px-6">
            <div className={cn('flex gap-3', showBackButton ? 'flex-row' : 'flex-col')}>
              {showBackButton ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white text-sm font-semibold text-[#111827] transition-colors hover:bg-[#F8FAFC]"
                >
                  <ArrowLeft className="size-4 shrink-0" />
                  Back
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleContinue}
                disabled={primaryDisabled}
                className={cn(
                  'inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-btn-primary text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] disabled:cursor-not-allowed disabled:opacity-50',
                  showBackButton ? 'flex-1' : 'w-full',
                )}
              >
                {primaryLabel}
                <ArrowRight className="size-4 shrink-0" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}
