import { Link } from 'react-router'

export default function HeroBadge() {
  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-[#E5E7EB] bg-white px-5 py-2 text-sm text-[#64748B] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <span>The #1 Rated UK Trades Marketplace</span>
      <span className="hidden text-[#D1D5DB] sm:inline">|</span>
      <span className="hidden sm:inline">🇬🇧 Direct UK Verification</span>
      <span className="hidden text-[#D1D5DB] md:inline">|</span>
      <Link to="/how-it-works" className="font-medium text-btn-primary hover:underline">
        Learn more
      </Link>
    </div>
  )
}
