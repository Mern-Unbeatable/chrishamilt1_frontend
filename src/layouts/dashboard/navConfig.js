import {
  Briefcase,
  Coins,
  Grid3x3,
  LayoutDashboard,
  MessageCircle,
  Search,
  Star,
  TrendingUp,
  User,
  Users,
  Wallet,
  FileText,
  CalendarCheck,
} from 'lucide-react'

export const TRADESMAN_NAV = [
  { label: 'Dashboard', to: '/tradesman/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Browse Jobs', to: '/tradesman/browse-jobs', icon: Search },
  { label: 'My Quotes', to: '/tradesman/quotes', icon: FileText },
  { label: 'My Jobs', to: '/tradesman/jobs', icon: Briefcase },
  { label: 'Messages', to: '/tradesman/messages', icon: MessageCircle },
  { label: 'Wallet & Tokens', to: '/tradesman/wallet', icon: Wallet },
  { label: 'Earnings', to: '/tradesman/earnings', icon: TrendingUp },
  { label: 'Reviews', to: '/tradesman/reviews', icon: Star },
  { label: 'My Profile', to: '/tradesman/profile', icon: User },
]

export const ADMIN_NAV = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Customers', to: '/admin/customers', icon: Users },
  { label: 'Tradesman', to: '/admin/tradesmen', icon: Briefcase },
  { label: 'Jobs', to: '/admin/jobs', icon: CalendarCheck },
  { label: 'Categories', to: '/admin/categories', icon: Grid3x3 },
  { label: 'Token management', to: '/admin/tokens', icon: Coins },
  { label: 'My Profile', to: '/admin/profile', icon: User },
]
