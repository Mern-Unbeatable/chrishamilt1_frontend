import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { cn } from '@/helpers/cn'

const DropdownContext = createContext(null)

export function Dropdown({ children, className }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={rootRef} className={cn('relative', className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

export function DropdownTrigger({ className, children, ...props }) {
  const { open, setOpen } = useContext(DropdownContext)

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center rounded-md border border-border bg-white px-3 py-2 text-sm font-medium',
        className,
      )}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
    </button>
  )
}

export function DropdownMenu({ className, children, align = 'left', ...props }) {
  const { open } = useContext(DropdownContext)

  if (!open) return null

  return (
    <div
      className={cn(
        'absolute top-full z-[100] mt-2 max-h-60 min-w-full overflow-y-auto rounded-lg border border-[#E5E7EB] bg-white py-1 shadow-lg',
        align === 'right' ? 'right-0' : 'left-0',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownItem({ className, onClick, children, ...props }) {
  const { setOpen } = useContext(DropdownContext)

  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center px-3 py-2 text-left text-sm hover:bg-primary',
        className,
      )}
      onClick={(event) => {
        onClick?.(event)
        setOpen(false)
      }}
      {...props}
    >
      {children}
    </button>
  )
}
