import { useEffect } from 'react'
import { Outlet } from 'react-router'
import { prefetchAuthImages } from '@/helpers/prefetchAuthImages'


export default function AuthLayout() {
  useEffect(() => {
    prefetchAuthImages({ highPriority: true })
  }, [])

  return <Outlet />
}
