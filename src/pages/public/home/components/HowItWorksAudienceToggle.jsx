import { cn } from '@/helpers/cn'
import { HOW_IT_WORKS_TABS } from '@/pages/public/home/components/howItWorks.constants'

export default function HowItWorksAudienceToggle({ activeTab, onChange }) {
  return (
    <div className="inline-flex rounded-full bg-white p-1 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      {HOW_IT_WORKS_TABS.map((tab) => {
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'rounded-full px-6 py-2.5 text-sm font-medium transition-colors sm:px-8',
              isActive
                ? 'bg-btn-primary text-white'
                : 'text-[#64748B] hover:text-[#111827]',
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
