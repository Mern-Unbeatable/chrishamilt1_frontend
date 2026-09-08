import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CloudUpload,
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

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024
const ACCEPTED_FILE_TYPES =
  'image/*,application/pdf,video/*,.pdf,.jpg,.jpeg,.png,.webp,.avif,.mp4,.mov'

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function AttachmentsStep({
  files = [],
  existingImages = [],
  onAddFiles,
  onRemoveFile,
  fileError = '',
}) {
  const inputRef = useRef(null)

  const handleFiles = (fileList) => {
    const nextFiles = Array.from(fileList ?? [])
    if (!nextFiles.length) return
    onAddFiles?.(nextFiles)
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          event.dataTransfer.dropEffect = 'copy'
        }}
        onDrop={(event) => {
          event.preventDefault()
          handleFiles(event.dataTransfer.files)
        }}
        className="w-full rounded-xl border-2 border-dashed border-[#BFDBFE] bg-[#F8FAFC] px-6 py-10 text-center transition-colors hover:border-btn-primary hover:bg-[#EFF6FF]"
      >
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#EFF6FF] text-btn-primary">
          <CloudUpload className="size-6" strokeWidth={1.75} />
        </span>
        <p className="mt-4 text-base font-semibold text-[#111827]">Drag &amp; Drop Files</p>
        <p className="mt-2 text-sm text-[#64748B]">
          Images, PDFs, or videos. Max 25MB per file.
        </p>
        <p className="mt-3 text-sm font-semibold text-btn-primary">Browse files</p>
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_FILE_TYPES}
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files)
          event.target.value = ''
        }}
      />

      {fileError ? (
        <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#B91C1C]">
          {fileError}
        </p>
      ) : null}

      {existingImages.length ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
            Current attachments
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {existingImages.map((image) => (
              <a
                key={image.id ?? image.url}
                href={image.url}
                target="_blank"
                rel="noreferrer"
                className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]"
              >
                <img
                  src={image.url}
                  alt="Existing quote attachment"
                  className="aspect-[4/3] w-full object-cover"
                />
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {files.length ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
            New uploads
          </p>
          <ul className="mt-3 space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${file.lastModified}-${index}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#111827]">{file.name}</p>
                  <p className="text-xs text-[#64748B]">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveFile?.(index)}
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-[#64748B] transition-colors hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="text-center text-sm text-[#64748B]">
        Attachments are optional but increase win rate by 40%
      </p>
    </div>
  )
}

function ReviewStep({ form, customerBudget }) {
  const attachmentCount = (form.images?.length ?? 0) + (form.existingImages?.length ?? 0)

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
          <div className="flex justify-between gap-4">
            <dt className="text-[#64748B]">Attachments</dt>
            <dd className="font-semibold text-[#111827]">
              {attachmentCount ? `${attachmentCount} file${attachmentCount === 1 ? '' : 's'}` : 'None'}
            </dd>
          </div>
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

function SuccessStep({ onViewQuotes, mode = 'create' }) {
  return (
    <div className="py-6 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#ECFDF5] text-[#059669]">
        <Check className="size-8" strokeWidth={2.25} />
      </span>
      <h3 className="mt-5 text-xl font-bold text-[#111827]">
        {mode === 'edit' ? 'Quote updated successfully' : 'Quote submitted successfully'}
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#64748B]">
        {mode === 'edit'
          ? 'Your changes have been saved. The customer will see your updated quote.'
          : 'Your quote has been sent to the customer. You can track its status from My Quotes.'}
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
    quoteAmount: '',
    duration: '',
    startDate: '',
    materialsIncluded: true,
    warranty: '',
    proposal: '',
    images: [],
    existingImages: [],
  }
}

export default function SendQuoteModal({
  open,
  onClose,
  jobTitle,
  customerBudget,
  onSubmit,
  onViewQuotes,
  mode = 'create',
  initialValues = null,
}) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(createInitialForm)
  const [submitting, setSubmitting] = useState(false)
  const [fileError, setFileError] = useState('')
  const wasOpenRef = useRef(false)
  const isEditMode = mode === 'edit'

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
      wasOpenRef.current = false
      setStep(1)
      setForm(createInitialForm())
      setSubmitting(false)
      setFileError('')
      return
    }

    if (!initialValues) return

    const justOpened = !wasOpenRef.current
    wasOpenRef.current = true

    if (justOpened || !isEditMode) {
      setForm({ ...createInitialForm(), ...initialValues })
      setStep(1)
      return
    }

    setForm((current) => ({
      ...current,
      quoteAmount: initialValues.quoteAmount ?? current.quoteAmount,
      duration: initialValues.duration ?? current.duration,
      startDate: initialValues.startDate ?? current.startDate,
      materialsIncluded: initialValues.materialsIncluded ?? current.materialsIncluded,
      warranty: initialValues.warranty ?? current.warranty,
      proposal:
        (initialValues.proposal?.length ?? 0) > (current.proposal?.length ?? 0)
          ? initialValues.proposal
          : current.proposal,
      existingImages: initialValues.existingImages ?? current.existingImages ?? [],
      images: current.images ?? [],
    }))
  }, [open, initialValues, isEditMode])

  if (!open) return null

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const addFiles = (incomingFiles) => {
    const validFiles = []
    const errors = []

    incomingFiles.forEach((file) => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        errors.push(`${file.name} exceeds 25MB.`)
        return
      }
      validFiles.push(file)
    })

    setFileError(errors[0] ?? '')
    if (!validFiles.length) return

    setForm((current) => ({
      ...current,
      images: [...(current.images ?? []), ...validFiles],
    }))
  }

  const removeFile = (index) => {
    setForm((current) => ({
      ...current,
      images: (current.images ?? []).filter((_, fileIndex) => fileIndex !== index),
    }))
    setFileError('')
  }

  const canContinueStep1 =
    form.quoteAmount.trim() && form.duration.trim() && form.startDate.trim()

  const canContinueStep2 = form.proposal.trim().length >= 100

  const handleContinue = async () => {
    if (step === 4) {
      setSubmitting(true)

      try {
        const result = await onSubmit?.(form)
        if (result === false || result === null) return
        setStep(5)
      } finally {
        setSubmitting(false)
      }

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
    step === 1
      ? 'Continue'
      : step === 3
        ? 'Continue'
        : step === 4
          ? isEditMode
            ? 'Update Quote'
            : 'Submit Quote'
          : null

  const primaryDisabled =
    submitting ||
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
                {isEditMode && step < 5 ? 'Edit Quote' : STEP_TITLES[step]}
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
              files={form.images}
              existingImages={form.existingImages}
              onAddFiles={addFiles}
              onRemoveFile={removeFile}
              fileError={fileError}
            />
          ) : null}
          {step === 4 ? <ReviewStep form={form} customerBudget={customerBudget} /> : null}
          {step === 5 ? <SuccessStep onViewQuotes={onViewQuotes} mode={mode} /> : null}
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
                {submitting
                  ? isEditMode
                    ? 'Updating…'
                    : 'Submitting…'
                  : primaryLabel}
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
