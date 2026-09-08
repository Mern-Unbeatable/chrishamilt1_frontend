export default function TradesmanEarningsRecentList({ items = [] }) {
  if (!items.length) return null

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
      <h2 className="text-base font-semibold text-[#111827]">Recent earnings</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#E5E7EB] text-xs uppercase tracking-wide text-[#64748B]">
              <th className="px-2 py-3 font-semibold">Job</th>
              <th className="px-2 py-3 font-semibold">Title</th>
              <th className="px-2 py-3 font-semibold">Amount</th>
              <th className="px-2 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-[#F1F5F9] last:border-0">
                <td className="px-2 py-3 font-medium text-[#111827]">{item.jobCode}</td>
                <td className="px-2 py-3 text-[#64748B]">{item.jobTitle}</td>
                <td className="px-2 py-3 font-semibold text-[#111827]">{item.amount}</td>
                <td className="px-2 py-3 text-[#64748B]">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
