import { TRADESMAN_JOB_STATUS_VALUES } from '@/data/tradesmanJobsData'

export default function TradesmanJobStatusActions({ status, onStatusChange, updating = false }) {
  const normalized = String(status ?? '').toLowerCase()

  const nextActions = []
  if (normalized === 'accepted') {
    nextActions.push(TRADESMAN_JOB_STATUS_VALUES.IN_PROGRESS)
  }
  if (normalized === 'in progress') {
    nextActions.push(TRADESMAN_JOB_STATUS_VALUES.COMPLETED)
  }

  if (!nextActions.length || !onStatusChange) return null

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-[#111827]">Update job status</h2>
      <p className="mt-1 text-sm text-[#64748B]">
        Mark progress so the customer stays informed.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        {nextActions.map((nextStatus) => (
          <button
            key={nextStatus}
            type="button"
            disabled={updating}
            onClick={() => onStatusChange(nextStatus)}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-btn-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0150CC] disabled:opacity-60"
          >
            Mark as {nextStatus}
          </button>
        ))}
      </div>
    </section>
  )
}
