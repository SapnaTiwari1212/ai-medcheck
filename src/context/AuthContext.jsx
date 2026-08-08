import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { apiPost, apiGet } from '../lib/api.js'

const AuthContext = createContext(null)

const TOKEN_KEY = 'medcheck_token'

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
    if (data?.token) localStorage.setItem(TOKEN_KEY, data.token)
    setUser(data?.user ?? null)
    return data
  }, [])

  const register = useCallback(async (body) => {
    const data = await apiPost('/api/auth/register', body)
    if (data?.token) localStorage.setItem(TOKEN_KEY, data.token)
    setUser(data?.user ?? null)
    return data
  }, [])

  const logout = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY)
    try {
      await apiPost('/api/auth/logout', {})
    } catch {
      /* session already expired */
    }
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
