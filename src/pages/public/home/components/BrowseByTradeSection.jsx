import TradeCard from '@/pages/public/home/components/TradeCard'
import { TRADE_CATEGORIES } from '@/pages/public/home/components/browseByTrade.constants'

export default function BrowseByTradeSection() {
  return (
    <section className="bg-white pb-20 pt-4 lg:pb-24">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-[#111827] sm:text-4xl">
            Browse by Trade
          </h2>
          <p className="mt-4 text-base text-[#64748B] sm:text-lg">
            Find the right specialist for your project
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {TRADE_CATEGORIES.map((trade) => (
            <TradeCard key={trade.name} {...trade} />
          ))}
        </div>
      </div>
    </section>
  )
}
