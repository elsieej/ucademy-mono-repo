import type { UserLoginResponseSchema, UserResponseSchema } from '@elsie/models'
import { createContext, type PropsWithChildren, use, useState } from 'react'

export type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: UserResponseSchema | null
  isAuthenticated: boolean

  login: (rs: UserLoginResponseSchema) => void
  logout: () => void
  updateUser: (user: UserResponseSchema) => void
  setAccessToken: (token: string) => void
  setRefreshToken: (token: string) => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserResponseSchema | null>(null)
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken') || null)
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken') || null)

  const updateUser = (user: UserResponseSchema) => {
    setUser(user)
  }

  const login = (rs: UserLoginResponseSchema) => {
    setAccessToken(rs.accessToken)
    setRefreshToken(rs.refreshToken)
    setUser(rs.user)

    localStorage.setItem('accessToken', rs.accessToken)
    localStorage.setItem('refreshToken', rs.refreshToken)
  }

  const logout = () => {
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  const updateAccessToken = (token: string) => {
    setAccessToken(token)
    localStorage.setItem('accessToken', token)
  }

  const updateRefreshToken = (token: string) => {
    setRefreshToken(token)
    localStorage.setItem('refreshToken', token)
  }

  const isAuthenticated = user !== null

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        updateUser,
        setAccessToken: updateAccessToken,
        setRefreshToken: updateRefreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }
