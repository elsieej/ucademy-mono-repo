import { getItemFromStorage, removeItemFromStorage, setItemToStorage } from '@/lib/storage'
import type { TokenResponseSchema, UserLoginResponseSchema, UserResponseSchema } from '@elsie/models'
import { createContext, type PropsWithChildren, use, useCallback, useState } from 'react'

export type AuthState = {
  isAuthenticated: boolean
  isLoading: boolean
  accessToken: string | null
  refreshToken: string | null
  user: UserResponseSchema | null

  updateLoading: (loading: boolean) => void
  updateUser: (user: UserResponseSchema | null) => void
  updateToken: (tokens: TokenResponseSchema) => void
  login: (user: UserLoginResponseSchema) => void
  logout: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserResponseSchema | null>(null)
  const [accessToken, setAccessToken] = useState(() => getItemFromStorage('ACCESS_TOKEN') || null)
  const [refreshToken, setRefreshToken] = useState(() => getItemFromStorage('REFRESH_TOKEN') || null)
  // Start with loading true if we have any token (need to verify/refresh it)
  const [isLoading, setIsLoading] = useState(() => {
    const hasAccessToken = !!getItemFromStorage('ACCESS_TOKEN')
    const hasRefreshToken = !!getItemFromStorage('REFRESH_TOKEN')
    return hasAccessToken || hasRefreshToken
  })

  const login = useCallback((rs: UserLoginResponseSchema) => {
    setAccessToken(rs.accessToken)
    setRefreshToken(rs.refreshToken)
    setUser(rs.user)
    setIsLoading(false) // Auth complete

    setItemToStorage('ACCESS_TOKEN', rs.accessToken)
    setItemToStorage('REFRESH_TOKEN', rs.refreshToken)
  }, [])

  const updateToken = useCallback((tokens: TokenResponseSchema) => {
    setAccessToken(tokens.accessToken)
    setRefreshToken(tokens.refreshToken)

    setItemToStorage('ACCESS_TOKEN', tokens.accessToken)
    setItemToStorage('REFRESH_TOKEN', tokens.refreshToken)
  }, [])

  const updateUser = useCallback((user: UserResponseSchema | null) => {
    setUser(user)
  }, [])

  const logout = useCallback(() => {
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)
    setIsLoading(false) // Clear loading state on logout

    removeItemFromStorage('ACCESS_TOKEN')
    removeItemFromStorage('REFRESH_TOKEN')
  }, [])

  const updateLoading = useCallback((loading: boolean) => {
    setIsLoading(loading)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: user !== null,
        isLoading,
        accessToken,
        refreshToken,
        user,
        updateLoading,
        updateUser,
        updateToken,
        login,
        logout
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
