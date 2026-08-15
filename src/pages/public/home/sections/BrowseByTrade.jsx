import { Link } from 'react-router'
import {
  Box,
  Building2,
  Droplets,
  Flame,
  Grid2x2,
  Grid3x3,
  Hammer,
  Home,
  Leaf,
  Paintbrush,
  Sparkles,
  Sun,
  Wrench,
  Zap,
} from 'lucide-react'

const TRADES = [
  { icon: Droplets, name: 'Plumbing', jobs: 234 },
  { icon: Zap, name: 'Electrical', jobs: 189 },
  { icon: Home, name: 'Roofing', jobs: 156 },
  { icon: Hammer, name: 'Carpentry', jobs: 143 },
  { icon: Paintbrush, name: 'Painting', jobs: 211 },
  { icon: Sparkles, name: 'Cleaning', jobs: 178 },
  { icon: Leaf, name: 'Gardening', jobs: 165 },
  { icon: Wrench, name: 'Handyman', jobs: 298 },
  { icon: Grid2x2, name: 'Flooring', jobs: 127 },
  { icon: Flame, name: 'Heating', jobs: 193 },
  { icon: Building2, name: 'Building', jobs: 89 },
  { icon: Sun, name: 'Renovation', jobs: 76 },
  { icon: Grid3x3, name: 'Tiling', jobs: 134 },
  { icon: Box, name: 'Flat Pack', jobs: 203 },
]

export default function BrowseByTrade() {
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
          {TRADES.map((trade) => {
            const Icon = trade.icon

            return (
              <Link
                key={trade.name}
                to="/services"
                className="flex flex-col items-center rounded-xl bg-primary px-4 py-6 text-center transition-colors hover:bg-[#DCE9FD]"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-btn-primary text-white">
                  <Icon className="size-5" strokeWidth={2} />
                </span>
                <span className="mt-4 text-sm font-semibold text-[#111827]">
                  {trade.name}
                </span>
                <span className="mt-1 text-xs text-[#64748B]">{trade.jobs} jobs</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
