import { useEffect, useRef, useState } from 'react'
import { Briefcase, ChevronDown, Upload, X } from 'lucide-react'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@/components/Dropdown'
import { cn } from '@/helpers/cn'
import { showApiErrorFromError, showErrorAlert } from '@/helpers/showAppAlert'
import {
  getCompletionMinDate,
  getTodayInputValue,
  validateJobDates,
} from '@/helpers/validateJobDates'
import {
  DEMO_POST_JOB_CATEGORIES,
  DEMO_POST_JOB_URGENCY,
} from '@/data/postJobData'

const controlClassName =
  'h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/10'

function FieldLabel({ children }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">
      {children}
    </span>
  )
}

function TextField({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  min,
  max,
  error = '',
}) {
  return (
    <label className="flex flex-col gap-2">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        min={min}
        max={max}
        className={cn(
          controlClassName,
          error && 'border-[#FCA5A5] focus:border-[#DC2626] focus:ring-[#DC2626]/10',
        )}
        aria-invalid={Boolean(error)}
      />
      {error ? <span className="text-xs text-[#DC2626]">{error}</span> : null}
    </label>
  )
}

function TextAreaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="flex flex-col gap-2">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(controlClassName, 'h-auto min-h-[96px] resize-y py-3')}
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
  getOptionLabel = (option) => option,
  getOptionValue = (option) => option,
}) {
  const selectedValue = getOptionValue(value)

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>{label}</FieldLabel>
      <Dropdown className="w-full">
        <DropdownTrigger className="h-11 w-full justify-between gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-0 font-normal text-[#111827] shadow-none hover:bg-white">
          <span className="truncate text-left text-sm">{getOptionLabel(value)}</span>
          <ChevronDown className="size-4 shrink-0 text-[#94A3B8]" />
        </DropdownTrigger>
        <DropdownMenu className="w-full min-w-0">
          {options.map((option) => {
            const optionLabel = getOptionLabel(option)
            const optionKey = getOptionValue(option) ?? optionLabel

            return (
              <DropdownItem
                key={optionKey}
                className={cn(
                  'text-sm',
                  getOptionValue(option) === selectedValue
                    ? 'bg-btn-primary text-white hover:bg-btn-primary'
                    : 'text-[#111827]',
                )}
                onClick={() => onChange(option)}
              >
                {optionLabel}
              </DropdownItem>
            )
          })}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

function UploadField({ files, onFilesChange, existingImages = [] }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const addFiles = (fileList) => {
    if (!fileList?.length) return
    onFilesChange([...files, ...Array.from(fileList)])
  }

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>Upload photos / docs</FieldLabel>

      {existingImages.length > 0 ? (
        <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#64748B]">
            Current photos
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {existingImages.map((image) => (
              <div
                key={image.id || image.url}
                className="size-16 overflow-hidden rounded-lg border border-[#E5E7EB] bg-white sm:size-20"
              >
                <img src={image.url} alt="" className="size-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click()
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          addFiles(event.dataTransfer.files)
        }}
        className={cn(
          'flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-4 py-8 text-center transition-colors',
          dragging
            ? 'border-btn-primary bg-[#EFF6FF]'
            : 'border-[#CBD5E1] bg-[#F8FAFC] hover:border-btn-primary/60 hover:bg-[#F8FAFC]',
        )}
      >
        <Upload className="size-6 text-btn-primary" strokeWidth={1.75} />
        <p className="mt-3 text-sm font-medium text-btn-primary">
          Click to upload or drag and drop
        </p>
        <p className="mt-1 text-xs text-[#64748B]">PNG, JPG or PDF up to 10MB</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/jpg,application/pdf"
          className="sr-only"
          onChange={(event) => {
            addFiles(event.target.files)
            event.target.value = ''
          }}
        />
      </div>
      {files.length > 0 ? (
        <ul className="space-y-1">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-lg bg-[#F8FAFC] px-3 py-2 text-sm text-[#374151]"
            >
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                onClick={() =>
                  onFilesChange(files.filter((_, fileIndex) => fileIndex !== index))
                }
                className="ml-3 shrink-0 text-[#94A3B8] hover:text-[#DC2626]"
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h2 className="border-b border-[#F1F5F9] pb-3 text-base font-semibold text-[#111827]">
      {children}
    </h2>
  )
}

export default function PostJobForm({
  defaultValues = {},
  categories = DEMO_POST_JOB_CATEGORIES.map((name) => ({ id: name, name })),
  categoriesLoading = false,
  mode = 'create',
  pageTitle,
  pageDescription,
  submitLabel,
  onSubmit,
  onClose,
  className = '',
}) {
  const initialCategory =
    categories.find((category) => category.id === defaultValues.categoryId) ??
    categories.find((category) => category.name === defaultValues.category) ??
    categories[0]

  const [form, setForm] = useState({
    category: initialCategory ?? null,
    urgency: defaultValues.urgency || DEMO_POST_JOB_URGENCY[1],
    location: defaultValues.location || '',
    city: defaultValues.city || '',
    budgetMin: defaultValues.budgetMin || '',
    budgetMax: defaultValues.budgetMax || '',
    customerName: defaultValues.customerName || '',
    customerPhone: defaultValues.customerPhone || '',
    customerEmail: defaultValues.customerEmail || '',
    title: defaultValues.title || '',
    description: defaultValues.description || '',
    requirements: defaultValues.requirements || '',
    specialInstruction: defaultValues.specialInstruction || '',
    preferredStart: defaultValues.preferredStart || '',
    completionBy: defaultValues.completionBy || '',
  })
  const [files, setFiles] = useState([])
  const [existingImages] = useState(defaultValues.existingImages ?? [])
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const isEditMode = mode === 'edit'
  const heading = pageTitle ?? (isEditMode ? 'Edit Job Post' : 'Post a Job (100% Free)')
  const description =
    pageDescription ??
    (isEditMode
      ? 'Update your job details and keep tradesmen informed'
      : 'Get quotes from verified UK tradesmen within minutes')
  const actionLabel =
    submitLabel ??
    (isEditMode ? 'Save Job Changes' : 'Post Job & Request Verified Quotes')
  const submitErrorTitle = isEditMode ? 'Unable to update job' : 'Unable to post job'
  const todayInputValue = getTodayInputValue()
  const completionMinDate = getCompletionMinDate(form.preferredStart)

  useEffect(() => {
    if (!categories.length || !defaultValues.categoryId) return

    const matchedCategory = categories.find(
      (category) => category.id === defaultValues.categoryId,
    )

    if (!matchedCategory) return

    setForm((current) =>
      current.category?.id === matchedCategory.id
        ? current
        : { ...current, category: matchedCategory },
    )
  }, [categories, defaultValues.categoryId])

  useEffect(() => {
    if (!categories.length) return

    setForm((current) => {
      if (current.category?.id) {
        const hasValidCategory = categories.some((category) => category.id === current.category.id)
        if (hasValidCategory) return current
      }

      return { ...current, category: categories[0] }
    })
  }, [categories])

  const setField = (key) => (value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => {
      if (!current[key] && key !== 'preferredStart') return current

      const next = { ...current }
      delete next[key]
      if (key === 'preferredStart') delete next.completionBy
      return next
    })
  }

  const handleDateBlur = () => {
    if (!form.preferredStart && !form.completionBy) return
    applyDateValidation(validateDates())
  }

  const validateDates = () =>
    validateJobDates({
      preferredStart: form.preferredStart,
      completionBy: form.completionBy,
    })

  const applyDateValidation = (result) => {
    if (!result.valid) {
      setFieldErrors((current) => ({
        ...current,
        [result.field]: result.message,
      }))
      return false
    }

    setFieldErrors((current) => {
      const next = { ...current }
      delete next.preferredStart
      delete next.completionBy
      return next
    })

    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (categoriesLoading) {
      await showErrorAlert({
        title: 'Categories loading',
        text: 'Please wait for job categories to finish loading, then try again.',
      })
      return
    }

    if (!form.category?.id) {
      await showErrorAlert({
        title: 'Missing category',
        text: 'Please select a valid job category before posting.',
      })
      return
    }

    if (!form.title.trim() || !form.description.trim() || !form.location.trim()) {
      await showErrorAlert({
        title: 'Missing information',
        text: 'Title, description, and location are required.',
      })
      return
    }

    if (!form.budgetMin || !form.budgetMax) {
      await showErrorAlert({
        title: 'Missing budget',
        text: 'Please enter both minimum and maximum budget.',
      })
      return
    }

    if (Number(form.budgetMin) > Number(form.budgetMax)) {
      await showErrorAlert({
        title: 'Invalid budget',
        text: 'Minimum budget cannot be greater than maximum budget.',
      })
      return
    }

    const dateValidation = validateDates()
    if (!applyDateValidation(dateValidation)) {
      await showErrorAlert({
        title: 'Invalid dates',
        text: dateValidation.message,
      })
      return
    }

    setSubmitting(true)

    try {
      await onSubmit?.({
        ...form,
        categoryId: form.category.id,
        specialNotes: form.specialInstruction,
        preferredStart: dateValidation.preferredStart,
        completionBy: dateValidation.completionBy,
        files,
      })
    } catch (err) {
      await showApiErrorFromError(err, submitErrorTitle)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-btn-primary text-white">
            <Briefcase className="size-6" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-[-0.02em] text-[#111827] sm:text-2xl">
              {heading}
            </h1>
            <p className="mt-1 text-sm leading-6 text-[#64748B]">{description}</p>
          </div>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#111827]"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 px-5 py-6 sm:px-8 sm:py-8">
        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Job category"
              value={form.category ?? { id: '', name: categoriesLoading ? 'Loading categories…' : 'Select a category' }}
              options={categories.length ? categories : [{ id: '', name: categoriesLoading ? 'Loading categories…' : 'No categories available' }]}
              getOptionLabel={(option) => option?.name ?? option}
              getOptionValue={(option) => option?.id ?? option}
              onChange={setField('category')}
            />
            <SelectField
              label="Urgency"
              value={form.urgency}
              options={DEMO_POST_JOB_URGENCY}
              onChange={setField('urgency')}
            />
            <TextField
              label="Location"
              value={form.location}
              onChange={setField('location')}
              placeholder="e.g. Kensington, London"
            />
            <TextField
              label="City"
              value={form.city}
              onChange={setField('city')}
              placeholder="e.g. London"
            />
            <TextField
              label="Minimum budget (£)"
              type="number"
              min="0"
              value={form.budgetMin}
              onChange={setField('budgetMin')}
              placeholder="240"
            />
            <TextField
              label="Maximum budget (£)"
              type="number"
              min="0"
              value={form.budgetMax}
              onChange={setField('budgetMax')}
              placeholder="300"
            />
          </div>
        </section>

        {!isEditMode ? (
          <section className="space-y-4">
            <SectionTitle>Customer information</SectionTitle>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <TextField
                label="Name"
                value={form.customerName}
                onChange={setField('customerName')}
                placeholder="Enter your full name"
              />
              <TextField
                label="Number"
                value={form.customerPhone}
                onChange={setField('customerPhone')}
                placeholder="Enter your number"
              />
              <TextField
                label="Email"
                value={form.customerEmail}
                onChange={setField('customerEmail')}
                placeholder="Enter your email address"
              />
            </div>
          </section>
        ) : null}

        <section className="space-y-4">
          <SectionTitle>Job information</SectionTitle>
          <TextField
            label="Title"
            value={form.title}
            onChange={setField('title')}
            placeholder="Write your work title"
          />
          <TextAreaField
            label="Description"
            value={form.description}
            onChange={setField('description')}
            placeholder="Write your job description"
            rows={5}
          />
          <TextAreaField
            label="Requirements"
            value={form.requirements}
            onChange={setField('requirements')}
            placeholder="Write your job requirements"
            rows={4}
          />
          <TextField
            label="Special instruction"
            value={form.specialInstruction}
            onChange={setField('specialInstruction')}
            placeholder="Write if you have any special instruction"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              label="Preferred start"
              type="date"
              value={form.preferredStart}
              onChange={setField('preferredStart')}
              onBlur={handleDateBlur}
              min={todayInputValue}
              error={fieldErrors.preferredStart}
            />
            <TextField
              label="Completion by"
              type="date"
              value={form.completionBy}
              onChange={setField('completionBy')}
              onBlur={handleDateBlur}
              min={completionMinDate}
              error={fieldErrors.completionBy}
            />
          </div>
          <UploadField
            files={files}
            onFilesChange={setFiles}
            existingImages={existingImages}
          />
        </section>

        <button
          type="submit"
          disabled={submitting || categoriesLoading || !categories.length}
          className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-btn-primary text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(1,96,242,0.65)] transition-colors hover:bg-[#0150CC] disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
        >
          {actionLabel}
        </button>
      </form>
    </div>
  )
}
