import { useEffect, useState } from 'react'
import {
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Sliders,
  Sparkles,
} from 'lucide-react'
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader'
import {
  DEFAULT_CONTACT_SETTINGS,
  fetchContactSettings,
  updateContactSettings,
} from '@/services/adminSettingsApi'
import { showApiErrorFromError, showSuccessAlert } from '@/helpers/showAppAlert'

function formatDisplayDate(isoString) {
  if (!isoString) return null
  try {
    const date = new Date(isoString)
    if (Number.isNaN(date.getTime())) return null
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return null
  }
}

export default function AdminContactSettingsPage() {
  const [form, setForm] = useState(DEFAULT_CONTACT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const data = await fetchContactSettings()
        if (!cancelled && data) {
          setForm(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Unable to load contact settings.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.address?.trim()) {
      setError('Please provide an official address.')
      return
    }

    if (!form.phone?.trim()) {
      setError('Please provide a support phone number.')
      return
    }

    if (!form.email?.trim() || !form.email.includes('@')) {
      setError('Please enter a valid support email address.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const updated = await updateContactSettings({
        address: form.address.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      })

      if (updated) {
        setForm(updated)
      }

      await showSuccessAlert({
        title: 'Settings Saved',
        text: 'Public contact information has been updated successfully across the website.',
      })
    } catch (err) {
      setError(err?.message || 'Failed to update contact settings.')
      await showApiErrorFromError(err, 'Unable to update contact settings')
    } finally {
      setSaving(false)
    }
  }

  const lastUpdatedText = formatDisplayDate(form.updatedAt)

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Site Settings"
        description="Manage company contact information and footer details displayed across the website."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Form Card */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-xs"
          >
            <div className="border-b border-[#E5E7EB] bg-[#F8FAFC] px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-btn-primary">
                    <Sliders className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-[#111827]">
                      Public Contact Details
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      Used for website footer, Contact Us page, and email footers
                    </p>
                  </div>
                </div>

                {lastUpdatedText ? (
                  <span className="hidden rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-btn-primary sm:inline-flex">
                    Updated {lastUpdatedText}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {error ? (
                <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
                  {error}
                </div>
              ) : null}

              {loading ? (
                <div className="flex items-center justify-center py-12 text-[#64748B]">
                  <Loader2 className="size-6 animate-spin text-btn-primary" />
                  <span className="ml-2 text-sm">Loading contact settings…</span>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#111827]">
                      Office Address <span className="text-[#DC2626]">*</span>
                    </label>
                    <div className="relative mt-1.5">
                      <div className="pointer-events-none absolute top-3 left-3 text-[#94A3B8]">
                        <MapPin className="size-4" />
                      </div>
                      <textarea
                        rows={3}
                        required
                        value={form.address}
                        onChange={handleChange('address')}
                        placeholder="e.g. 1 enterprise house, barkering, London IG11 0JZ, United Kingdom"
                        className="w-full rounded-lg border border-[#E5E7EB] bg-white pt-2.5 pr-4 pb-2.5 pl-9 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
                      />
                    </div>
                    <span className="mt-1 block text-xs text-[#64748B]">
                      This will replace the physical address shown on the footer and contact page.
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#111827]">
                      Support Phone Number <span className="text-[#DC2626]">*</span>
                    </label>
                    <div className="relative mt-1.5">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#94A3B8]">
                        <Phone className="size-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={form.phone}
                        onChange={handleChange('phone')}
                        placeholder="e.g. 07392255366"
                        className="h-11 w-full rounded-lg border border-[#E5E7EB] bg-white pr-4 pl-9 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
                      />
                    </div>
                    <span className="mt-1 block text-xs text-[#64748B]">
                      Visitors can click this number to call directly.
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#111827]">
                      Support Email Address <span className="text-[#DC2626]">*</span>
                    </label>
                    <div className="relative mt-1.5">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#94A3B8]">
                        <Mail className="size-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange('email')}
                        placeholder="e.g. admin@tradersinloop.co.uk"
                        className="h-11 w-full rounded-lg border border-[#E5E7EB] bg-white pr-4 pl-9 text-sm text-[#111827] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-btn-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Saving changes…
                        </>
                      ) : (
                        <>
                          <Save className="size-4" />
                          Save changes
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Right Live Preview Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xs sm:p-6">
            <div className="flex items-center gap-2 text-btn-primary">
              <Sparkles className="size-4.5" />
              <h3 className="text-sm font-bold tracking-wide uppercase">
                Live Footer Preview
              </h3>
            </div>
            <p className="mt-1 text-xs text-[#64748B]">
              Real-time representation of how visitors see your contact details in the footer.
            </p>

            <div className="mt-5 rounded-xl border border-[#CBD5E1] bg-[#F1F5F9] p-4.5">
              <h4 className="text-sm font-semibold text-[#0F172A]">Contact Us</h4>
              <ul className="mt-3.5 space-y-3">
                <li className="flex items-start gap-2.5 text-xs text-[#334155]">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-btn-primary" />
                  <span className="leading-5 font-medium">
                    {form.address || '1 enterprise house, barkering, London...'}
                  </span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-[#334155]">
                  <Phone className="size-4 shrink-0 text-btn-primary" />
                  <a
                    href={`tel:${form.phone}`}
                    className="font-medium hover:text-btn-primary hover:underline"
                  >
                    {form.phone || '07392255366'}
                  </a>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-[#334155]">
                  <Mail className="size-4 shrink-0 text-btn-primary" />
                  <a
                    href={`mailto:${form.email}`}
                    className="font-medium hover:text-btn-primary hover:underline break-all"
                  >
                    {form.email || 'admin@tradersinloop.co.uk'}
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#64748B]">
              <span>Changes apply platform-wide immediately.</span>
              <a
                href="/contact"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-btn-primary hover:underline"
              >
                View Contact Page
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
