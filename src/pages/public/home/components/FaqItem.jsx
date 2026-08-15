import { ChevronDown } from 'lucide-react'
import { cn } from '@/helpers/cn'

export default function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-sm font-medium text-[#111827] sm:text-base">
          {question}
        </span>
        <ChevronDown
          className={cn(
            'size-5 shrink-0 text-[#94A3B8] transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-200 ease-in-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm leading-7 text-[#64748B]">{answer}</p>
        </div>
      </div>
    </div>
  )
}
