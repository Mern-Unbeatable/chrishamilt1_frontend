import { useState } from 'react'
import PageHeader from '@/components/PageHeader'
import { showSuccessAlert } from '@/helpers/showAppAlert'
import Cta from '@/pages/public/home/sections/Cta'

const SUPPORT_EMAIL = 'support@tradetrust.uk'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const updateField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    const body = [
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      '',
      form.message.trim(),
    ].join('\n')

    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      form.subject.trim() || 'TradeTrust enquiry',
    )}&body=${encodeURIComponent(body)}`

    window.location.href = mailto

    await showSuccessAlert({
      title: 'Opening your email app',
      text: `Your message draft is ready for ${SUPPORT_EMAIL}.`,
    })

    setForm({ name: '', email: '', subject: '', message: '' })
    setSubmitting(false)
  }

  return (
    <>
      <section data-scroll-section className="bg-[#F8FAFC] py-12 lg:py-16">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <PageHeader
              title="Contact"
              description="Get in touch with our team for support or partnership inquiries."
            />

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              <aside className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
                <h2 className="text-base font-semibold text-[#111827]">Reach us</h2>
                <dl className="mt-4 space-y-4 text-sm text-[#64748B]">
                  <div>
                    <dt className="font-semibold text-[#111827]">Email</dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${SUPPORT_EMAIL}`}
                        className="text-btn-primary hover:underline"
                      >
                        {SUPPORT_EMAIL}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#111827]">Phone</dt>
                    <dd className="mt-1">+44 20 7946 0958</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[#111827]">Office</dt>
                    <dd className="mt-1">
                      221B Baker Street
                      <br />
                      London, NW1 6XE
                    </dd>
                  </div>
                </dl>
              </aside>

              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6"
              >
                <h2 className="text-base font-semibold text-[#111827]">Send a message</h2>
                <p className="mt-1 text-sm text-[#64748B]">
                  Opens your email app with a ready-to-send draft.
                </p>

                <div className="mt-5 space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-[#111827]">Full name</span>
                    <input
                      required
                      value={form.name}
                      onChange={updateField('name')}
                      className="mt-1.5 h-11 w-full rounded-lg border border-[#E5E7EB] px-4 text-sm outline-none focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-[#111827]">Email</span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={updateField('email')}
                      className="mt-1.5 h-11 w-full rounded-lg border border-[#E5E7EB] px-4 text-sm outline-none focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-[#111827]">Subject</span>
                    <input
                      required
                      value={form.subject}
                      onChange={updateField('subject')}
                      className="mt-1.5 h-11 w-full rounded-lg border border-[#E5E7EB] px-4 text-sm outline-none focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-[#111827]">Message</span>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={updateField('message')}
                      className="mt-1.5 w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-btn-primary focus:ring-2 focus:ring-btn-primary/15"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-btn-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] disabled:opacity-60"
                >
                  {submitting ? 'Opening…' : 'Send message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Cta postJobTo="/post-job" />
    </>
  )
}
