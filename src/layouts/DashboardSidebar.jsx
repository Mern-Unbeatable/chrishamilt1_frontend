import { NavLink, Outlet } from 'react-router'
import { cn } from '@/helpers/cn'

export default function DashboardSidebar({ title, navItems = [] }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground lg:block">
      <div className="flex h-16 items-center border-b px-6">
        <span className="font-semibold">{title}</span>
      </div>
      <nav className="space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export function DashboardShell({ title, navItems, children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar title={title} navItems={navItems} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b px-6">
          <h1 className="text-lg font-semibold lg:hidden">{title}</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

export function DashboardContent() {
  return <Outlet />
}
