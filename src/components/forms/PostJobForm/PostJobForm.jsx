import { useRef, useState } from 'react'
import { Briefcase, ChevronDown, Upload, X } from 'lucide-react'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@/components/Dropdown'
import { cn } from '@/helpers/cn'
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

function TextField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="flex flex-col gap-2">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={controlClassName}
      />
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

function SelectField({ label, value, options, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>{label}</FieldLabel>
      <Dropdown className="w-full">
        <DropdownTrigger className="h-11 w-full justify-between gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-0 font-normal text-[#111827] shadow-none hover:bg-white">
          <span className="truncate text-left text-sm">{value}</span>
          <ChevronDown className="size-4 shrink-0 text-[#94A3B8]" />
        </DropdownTrigger>
        <DropdownMenu className="w-full min-w-0">
          {options.map((option) => (
            <DropdownItem
              key={option}
              className={cn(
                'text-sm',
                value === option
                  ? 'bg-btn-primary text-white hover:bg-btn-primary'
                  : 'text-[#111827]',
              )}
              onClick={() => onChange(option)}
            >
              {option}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

function UploadField({ files, onFilesChange }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const addFiles = (fileList) => {
    if (!fileList?.length) return
    onFilesChange([...files, ...Array.from(fileList)])
  }

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>Upload photos / docs</FieldLabel>
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
  onSubmit,
  onClose,
  className = '',
}) {
  const [form, setForm] = useState({
    category: defaultValues.category || DEMO_POST_JOB_CATEGORIES[2],
    urgency: defaultValues.urgency || DEMO_POST_JOB_URGENCY[1],
    location: defaultValues.location || '',
    priceRange: defaultValues.priceRange || '',
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
  const [submitting, setSubmitting] = useState(false)

  const setField = (key) => (value) => setForm((current) => ({ ...current, [key]: value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    await onSubmit?.({ ...form, files })
    setSubmitting(false)
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
              Post a Job (100% Free)
            </h1>
            <p className="mt-1 text-sm leading-6 text-[#64748B]">
              Get quotes from verified UK tradesmen within minutes
            </p>
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
              value={form.category}
              options={DEMO_POST_JOB_CATEGORIES}
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
              placeholder="Enter your address"
            />
            <TextField
              label="Price"
              value={form.priceRange}
              onChange={setField('priceRange')}
              placeholder="£100–£200"
            />
          </div>
        </section>

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
            />
            <TextField
              label="Completion by"
              type="date"
              value={form.completionBy}
              onChange={setField('completionBy')}
            />
          </div>
          <UploadField files={files} onFilesChange={setFiles} />
        </section>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-btn-primary text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(1,96,242,0.65)] transition-colors hover:bg-[#0150CC] disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
        >
          Post Job &amp; Request Verified Quotes
        </button>
      </form>
    </div>
  )
}
