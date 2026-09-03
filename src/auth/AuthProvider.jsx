import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getRememberMePreference } from '@/auth/authStorage'
import { getSession, login as loginRequest, logout as logoutRequest, register as registerRequest } from '@/auth/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession())

  const login = useCallback(async (email, password, options = {}) => {
    const rememberMe = options.rememberMe ?? getRememberMePreference()
    const user = await loginRequest({ email, password, rememberMe })

    if (!user) return null

    setSession(user)
    return user
  }, [])

  const register = useCallback(async (payload) => {
    const result = await registerRequest(payload)

    if (result.session) {
      setSession(result.session)
    }

    return result
  }, [])

  const logout = useCallback(async () => {
    await logoutRequest()
    setSession(null)
  }, [])

  const refreshSession = useCallback(() => {
    setSession(getSession())
  }, [])

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      isUser: session?.role === 'user',
      isTradesman: session?.role === 'tradesman',
      isAdmin: session?.role === 'admin',
      login,
      register,
      logout,
      refreshSession,
    }),
    [session, login, register, logout, refreshSession],
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
