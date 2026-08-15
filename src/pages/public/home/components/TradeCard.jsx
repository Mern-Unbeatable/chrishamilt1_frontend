import { Link } from 'react-router'

export default function TradeCard({ icon: Icon, name, jobs }) {
  return (
    <Link
      to="/services"
      className="flex flex-col items-center rounded-xl bg-primary px-4 py-6 text-center transition-colors hover:bg-[#DCE9FD]"
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-btn-primary text-white">
        <Icon className="size-5" strokeWidth={2} />
      </span>

      <span className="mt-4 text-sm font-semibold text-[#111827]">{name}</span>
      <span className="mt-1 text-xs text-[#64748B]">{jobs} jobs</span>
    </Link>
  )
}
