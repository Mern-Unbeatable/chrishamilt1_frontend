import { useState } from 'react'
import { ChevronDown, LayoutGrid } from 'lucide-react'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@/components/Dropdown'
import { HERO_CATEGORIES } from '@/pages/public/home/components/hero.constants'

export default function HeroCategorySelect() {
  const [category, setCategory] = useState(HERO_CATEGORIES[0])

  return (
    <Dropdown className="w-full sm:min-w-[240px] sm:max-w-[280px]">
      <DropdownTrigger className="h-12 w-full justify-between gap-3 rounded-full border-0 bg-transparent px-4 shadow-none hover:bg-[#F8FAFC]">
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-btn-primary">
            <LayoutGrid className="size-4" strokeWidth={2.25} />
          </span>
          <span className="truncate text-sm font-medium text-[#111827]">
            {category}
          </span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-[#94A3B8]" />
      </DropdownTrigger>
      <DropdownMenu className="left-0 w-full min-w-[240px]">
        {HERO_CATEGORIES.map((item) => (
          <DropdownItem key={item} onClick={() => setCategory(item)}>
            {item}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
