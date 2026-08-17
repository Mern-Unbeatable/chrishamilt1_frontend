import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  authenticateDemoUser,
  clearDemoSession,
  getDemoSession,
} from '@/auth/demoAuth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getDemoSession())

  const login = useCallback((email, password) => {
    const user = authenticateDemoUser(email, password)
    if (!user) return null
    setSession(user)
    return user
  }, [])

  const logout = useCallback(() => {
    clearDemoSession()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      isUser: session?.role === 'user',
      login,
      logout,
    }),
    [session, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
