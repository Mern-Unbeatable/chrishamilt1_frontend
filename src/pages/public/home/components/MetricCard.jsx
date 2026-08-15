export default function MetricCard({
  icon: Icon,
  iconClassName,
  value,
  label,
  description,
}) {
  return (
    <article className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
      <div
        className={`mb-5 flex size-10 items-center justify-center rounded-lg ${iconClassName}`}
      >
        <Icon className="size-5" strokeWidth={2} />
      </div>

      <p className="text-lg font-semibold text-[#111827]">
        <span className="font-bold">{value}</span> {label}
      </p>

      <p className="mt-2 text-sm leading-6 text-[#64748B]">{description}</p>
    </article>
  )
}
