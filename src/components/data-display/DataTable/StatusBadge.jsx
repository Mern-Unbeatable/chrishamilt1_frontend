import { ChevronDown } from 'lucide-react'

const STATUS_STYLES = {
  completed: 'bg-[#ECFDF5] text-[#059669]',
  accepted: 'bg-[#EFF6FF] text-[#2563EB]',
  'in progress': 'bg-[#ECFEFF] text-[#0891B2]',
  'in-progress': 'bg-[#ECFEFF] text-[#0891B2]',
  pending: 'bg-[#FFF7ED] text-[#EA580C]',
  active: 'bg-[#ECFDF5] text-[#059669]',
  suspend: 'bg-[#FFF7ED] text-[#EA580C]',
  suspended: 'bg-[#FFF7ED] text-[#EA580C]',
  rejected: 'bg-[#FEF2F2] text-[#DC2626]',
  withdrawn: 'bg-[#F1F5F9] text-[#64748B]',
  submitted: 'bg-[#FFFBEB] text-[#D97706]',
  default: 'bg-[#F1F5F9] text-[#64748B]',
}

export default function StatusBadge({
  status,
  label,
  showChevron = false,
  className = '',
}) {
  const key = String(status || label || '')
    .trim()
    .toLowerCase()
  const styles = STATUS_STYLES[key] || STATUS_STYLES.default

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${styles} ${className}`}
    >
      {label || status}
      {showChevron ? (
        <ChevronDown className="size-3.5 shrink-0 opacity-80" aria-hidden />
      ) : null}
    </span>
  )
}
