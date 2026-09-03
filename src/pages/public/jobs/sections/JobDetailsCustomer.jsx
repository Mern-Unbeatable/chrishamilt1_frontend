import { Mail, Phone } from 'lucide-react'

export default function JobDetailsCustomer({ customer }) {
  if (!customer) return null

  const hasContactDetails = Boolean(customer.phone || customer.email)

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-6 lg:p-8">
      <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--secondary-text)]">
        Customer Information
      </h2>

      <div className="mt-6 flex items-center gap-4">
        {customer.avatar ? (
          <img
            src={customer.avatar}
            alt={customer.name}
            className="size-14 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-btn-primary">
            {customer.name.charAt(0)}
          </div>
        )}

        <p className="text-lg font-semibold text-[var(--primary-text)]">{customer.name}</p>
      </div>

      {hasContactDetails ? (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-[var(--primary-text)]">Contact Details</h3>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {customer.phone ? (
              <div className="rounded-xl bg-[#F8FAFC] p-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                    <Phone className="size-4 text-[#059669]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[var(--secondary-text)]">Phone</p>
                    <p className="mt-1 text-sm font-semibold text-[var(--primary-text)]">
                      {customer.phone}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {customer.email ? (
              <div className="rounded-xl bg-[#F8FAFC] p-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                    <Mail className="size-4 text-btn-primary" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[var(--secondary-text)]">Email</p>
                    <p className="mt-1 break-all text-sm font-semibold text-[var(--primary-text)]">
                      {customer.email}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  )
}
