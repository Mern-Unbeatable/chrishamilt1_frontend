import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router'
import { Coins, CreditCard, MapPin, Tag, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { getSession } from '@/auth/authService'
import { fetchTradesmanAvailableTokens, resolveQuoteTokenCost } from '@/services/tradesmanWalletApi'
import { showSuccessAlert } from '@/helpers/showAppAlert'

export default function BuyLeadModal({
  open,
  onClose,
  job,
  onBuyWithToken,
}) {
  const navigate = useNavigate()
  const [tokenBalance, setTokenBalance] = useState(null)
  const [loadingBalance, setLoadingBalance] = useState(false)
  const [purchasing, setPurchasing] = useState(false)

  const session = getSession()
  const isTradesman = session?.role === 'tradesman'
  const isLoggedIn = Boolean(session?.accessToken || session?.name)

  const tokenCost = Number(job?.tokenCost ?? job?.leadPrice ?? 0)

  useEffect(() => {
    if (!open) {
      setTokenBalance(null)
      setLoadingBalance(false)
      return undefined
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    if (isTradesman) {
      setLoadingBalance(true)
      setTokenBalance(null)
      fetchTradesmanAvailableTokens()
        .then((balance) => setTokenBalance(balance))
        .catch(() => setTokenBalance(0))
        .finally(() => setLoadingBalance(false))
    }

    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [open, isTradesman])

  if (!open || !job) return null

  const hasEnoughTokens =
    isTradesman &&
    !loadingBalance &&
    tokenBalance !== null &&
    tokenBalance >= tokenCost

  const handleBuyWithCard = () => {
    onClose?.()
    navigate('/pricing')
  }

  const handleBuyWithToken = async () => {
    if (!isLoggedIn) {
      onClose?.()
      navigate('/auth/login')
      return
    }

    if (!isTradesman) {
      onClose?.()
      navigate('/auth/login')
      return
    }

    if (loadingBalance) return

    if (!hasEnoughTokens) {
      onClose?.()
      navigate('/pricing')
      return
    }

    if (onBuyWithToken) {
      onBuyWithToken(job)
      onClose?.()
      return
    }

    setPurchasing(true)
    try {
      await showSuccessAlert({
        title: 'Lead Unlocked!',
        text: `Successfully unlocked "${job.title}" using ${tokenCost} tokens. Customer contact details are now accessible.`,
      })
      onClose?.()
      navigate(`/tradesman/browse-jobs/${job.id}`)
    } finally {
      setPurchasing(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-120 flex items-end justify-center bg-black/50 p-4 backdrop-blur-xs sm:items-center">
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="buy-lead-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
          <div>
            <h2 id="buy-lead-title" className="text-lg font-bold text-[#111827]">
              Purchase Job Lead
            </h2>
            <p className="text-xs text-[#64748B]">
              Unlock customer contact details & submit your quote
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="inline-flex size-8 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#111827]"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Lead Details Card */}
        <div className="p-6 space-y-5">
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                {job.category ? (
                  <span className="inline-flex items-center gap-1 rounded-md border border-[#CBD5E1] bg-white px-2.5 py-0.5 text-xs font-medium text-[#475569]">
                    <Tag className="size-3" />
                    {job.category}
                  </span>
                ) : null}
                <h3 className="mt-2 text-base font-semibold text-[#111827] line-clamp-2">
                  {job.title}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748B]">
                  {job.location ? (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5 text-[#94A3B8]" />
                      {job.location}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Token Cost Badge */}
              {tokenCost > 0 ? (
                <div className="shrink-0 text-right">
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 shadow-xs">
                    <Coins className="size-3.5 text-amber-600" />
                    {tokenCost} Tokens
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Wallet Balance Status */}
          {isTradesman ? (
            <div className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-xs">
              <span className="text-[#64748B]">Your Available Balance:</span>
              <span className="font-bold text-[#0F172A]">
                {loadingBalance ? (
                  <span className="text-[#94A3B8] animate-pulse">Checking…</span>
                ) : (
                  `${Number(tokenBalance ?? 0).toLocaleString()} Tokens`
                )}
              </span>
            </div>
          ) : null}

          {/* Purchase Options */}
          <div className="space-y-3 pt-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Choose payment method
            </p>

            {/* Option 1: Buy with Token */}
            <button
              type="button"
              onClick={handleBuyWithToken}
              disabled={purchasing || loadingBalance}
              className={`group flex w-full items-center rounded-xl border p-3.5 text-left transition-all ${
                hasEnoughTokens
                  ? 'border-btn-primary/40 bg-btn-primary/5 hover:border-btn-primary hover:bg-btn-primary/10'
                  : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700">
                  <Coins className="size-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#0F172A]">
                    Buy with Token
                  </span>
                  {loadingBalance ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 animate-pulse">
                      Checking…
                    </span>
                  ) : hasEnoughTokens ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      <CheckCircle2 className="size-3" /> Ready
                    </span>
                  ) : isTradesman ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                      <AlertCircle className="size-3" /> Need {tokenCost} Tokens
                    </span>
                  ) : null}
                </div>
              </div>
            </button>

            {/* Option 2: Buy with CARD */}
            <button
              type="button"
              onClick={handleBuyWithCard}
              className="group flex w-full items-center rounded-xl border border-[#E2E8F0] bg-white p-3.5 text-left transition-all hover:border-btn-primary hover:bg-btn-primary/5"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-btn-primary/10 text-btn-primary">
                  <CreditCard className="size-6" />
                </div>
                <span className="font-bold text-sm text-[#0F172A]">
                  Buy with CARD
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E5E7EB] bg-[#F8FAFC] px-6 py-3.5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold text-[#475569] transition-colors hover:bg-[#F1F5F9]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
