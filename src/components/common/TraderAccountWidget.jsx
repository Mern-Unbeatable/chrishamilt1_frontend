import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Coins } from 'lucide-react'
import { useAuth } from '@/auth/AuthProvider'
import { fetchTradesmanAvailableTokens } from '@/services/tradesmanWalletApi'
import { cn } from '@/helpers/cn'

export default function TraderAccountWidget({ className = '', compact = false }) {
  const { session } = useAuth()
  const [tokens, setTokens] = useState(() => Number(session?.tokenBalance ?? 0))

  useEffect(() => {
    let cancelled = false

    async function loadTokens() {
      try {
        const bal = await fetchTradesmanAvailableTokens()
        if (!cancelled && typeof bal === 'number') {
          setTokens(bal)
        }
      } catch {
        // Fall back to session balance
      }
    }

    loadTokens()
    return () => {
      cancelled = true
    }
  }, [session?.tokenBalance])

  const traderName =
    session?.name?.trim() ||
    session?.fullName?.trim() ||
    [session?.firstName, session?.lastName].filter(Boolean).join(' ').trim() ||
    'Trader'

  return (
    <div className={cn('flex items-center gap-3 sm:gap-4', className)}>
      {/* Left side: Balance */}
      <Link
        to="/tradesman/wallet"
        className="group flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 transition-all hover:border-[#CBD5E1] hover:bg-[#F1F5F9]"
        title="View token wallet & top up"
      >
        <Coins className="size-4 shrink-0 text-amber-500 transition-transform group-hover:scale-110" />
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] leading-none">
            Balance
          </span>
          <span className="text-xs sm:text-sm font-bold leading-tight text-[#0F172A]">
            {Number(tokens).toLocaleString('en-GB')}{' '}
            <span className="text-[11px] font-medium text-[#64748B]">Tokens</span>
          </span>
        </div>
      </Link>

      {/* Right side: Trader Account & Trader Name */}
      <Link
        to="/tradesman/dashboard"
        className="group flex flex-col text-right min-w-0"
        title="Go to dashboard"
      >
        <span className="text-xs font-medium text-[#64748B] leading-tight">
          Trader Account
        </span>
        <span className="truncate text-xs sm:text-sm font-bold text-[#0F172A] leading-tight transition-colors group-hover:text-btn-primary">
          {traderName}
        </span>
      </Link>
    </div>
  )
}
