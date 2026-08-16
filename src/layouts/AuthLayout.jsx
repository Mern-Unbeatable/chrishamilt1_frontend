import { Outlet } from 'react-router'

/** Auth pages (login, register) are self-contained full-screen layouts. */
export default function AuthLayout() {
  return <Outlet />
}
