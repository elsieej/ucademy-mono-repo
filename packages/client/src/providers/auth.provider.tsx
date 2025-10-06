import type { UserResponseSchema } from '@elsie/models'
import { createContext, type PropsWithChildren, use, useState } from 'react'

export type AuthState = {
  isAuthenticated: boolean
  user: UserResponseSchema | null
  updateUser: (user: UserResponseSchema) => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserResponseSchema | null>(null)
  const updateUser = (user: UserResponseSchema) => {
    setUser(user)
  }
  const isAuthenticated = user !== null
  return <AuthContext.Provider value={{ isAuthenticated, user, updateUser }}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }
