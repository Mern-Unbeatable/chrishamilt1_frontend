import { Outlet } from 'react-router'
import Logo from '@/components/Logo'

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Logo className="text-primary-foreground" />
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="text-primary-foreground/80">
            Sign in to manage bookings, jobs, and your account.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
