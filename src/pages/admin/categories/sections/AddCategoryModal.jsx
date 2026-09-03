import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import TradeIcon from '@/components/common/TradeIcon'
import CategoryIconPicker from '@/pages/admin/categories/sections/CategoryIconPicker'

export default function AddCategoryModal({ open, onClose, onSave }) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('Wrench')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return undefined

    setName('')
    setIcon('Wrench')
    setError('')
    setSaving(false)

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

  if (!open) return null

  const canSave = name.trim().length > 0 && Boolean(icon)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)

    try {
      const result = await onSave?.({ name, icon })

      if (result?.ok) {
        onClose?.()
        return
      }

      setError(result?.error ?? 'Unable to save category.')
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close add category dialog"
        className="absolute inset-0 bg-[#111827]/50"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-category-title"
        className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[88vh] sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <h2 id="add-category-title" className="text-lg font-semibold text-[#111827]">
            Add Category
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-8 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#111827]"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5">
          <label className="block">
            <span className="text-sm font-medium text-[#111827]">Category name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                if (error) setError('')
              }}
              placeholder="Category name"
              className="mt-2 h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
              autoFocus
            />
          </label>

          <div className="mt-5">
            <CategoryIconPicker
              value={icon}
              onChange={(nextIcon) => {
                setIcon(nextIcon)
                if (error) setError('')
              }}
            />
          </div>

          <div className="mt-5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              Landing page preview
            </p>
            <div className="mt-3 flex flex-col items-center rounded-xl bg-primary px-4 py-5 text-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-btn-primary text-white">
                <TradeIcon name={icon} className="size-5" strokeWidth={2} />
              </span>
              <span className="mt-3 text-sm font-semibold text-[#111827]">
                {name.trim() || 'Category name'}
              </span>
              <span className="mt-1 text-xs text-[#64748B]">0 jobs</span>
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-[#DC2626]">{error}</p> : null}

          <div className="mt-5 border-t border-[#E5E7EB] pt-4">
            <button
              type="submit"
              disabled={!canSave || saving}
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-btn-primary text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
