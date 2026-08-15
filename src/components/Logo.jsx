import { Link } from 'react-router'
import { cn } from '@/helpers/cn'
import logo from '@/assets/logo.png'

export default function Logo({ className }) {
  return (
    <Link to="/" className={cn('inline-flex items-center', className)}>
      <img src={logo} alt="Traders In Loop" className="h-10 w-auto sm:h-14" />
    </Link>
  )
}
