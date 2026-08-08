import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { apiPost, apiGet } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGet('/api/users/me')
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await apiPost('/api/auth/login', { email, password })
    setUser(data?.user ?? null)
    return data
  }, [])

  const register = useCallback(async (body) => {
    const data = await apiPost('/api/auth/register', body)
    setUser(data?.user ?? null)
    return data
  }, [])

  const logout = useCallback(async () => {
    await apiPost('/api/auth/logout', {})
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
