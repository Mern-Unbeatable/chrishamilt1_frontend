import { StatusBadge } from '@/components/data-display/DataTable/DataTable'

export default function AdminTradesmanCompletedJobsCard({ completedJobs }) {
  const { summary, jobs, footer } = completedJobs

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-[#111827]">Completed Jobs</h2>
        <p className="text-sm text-[#64748B]">
          {summary.count} jobs • {summary.earned} earned
        </p>
      </div>

      <ul className="mt-3 space-y-2.5">
        {jobs.map((job, index) => (
          <li
            key={job.id}
            className="flex gap-3 rounded-xl border border-[#F1F5F9] bg-[#FAFCFF] p-3.5"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#ECFDF5] text-sm font-bold text-[#059669]">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#111827]">{job.title}</p>
                  <p className="mt-1 text-xs text-[#64748B]">
                    {job.client} • {job.date}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <p className="text-sm font-semibold text-[#111827]">{job.price}</p>
                  <StatusBadge status={job.status} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[#F1F5F9] pt-3">
        <div className="text-center">
          <p className="text-lg font-bold text-[#111827]">{footer.quotesSent}</p>
          <p className="mt-1 text-xs text-[#64748B]">Quotes Sent</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-[#111827]">{footer.jobsWon}</p>
          <p className="mt-1 text-xs text-[#64748B]">Jobs Won</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-[#111827]">{footer.avgValue}</p>
          <p className="mt-1 text-xs text-[#64748B]">Avg Value</p>
        </div>
      </div>
    </section>
  )
}
