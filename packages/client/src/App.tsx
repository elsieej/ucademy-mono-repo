import { createRouter, RouterProvider } from '@tanstack/react-router'
import { useAuth } from './providers/auth.provider'
// Import the generated route tree
import { Toaster } from '@/components/ui/sonner'
import type { AppRouter } from '@elsie/server'
import { QueryClient, QueryClientProvider, type QueryKey } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import { useEffect, useMemo, useRef, type PropsWithChildren } from 'react'
import superjson from 'superjson'
import { config } from './constants/config'
import { TRPCProvider } from './lib/trpc'
import { routeTree } from './routeTree.gen'
import { useAuthGetMeQuery } from './hooks/apis/use-auth.api'
import { setItemToStorage } from './lib/storage'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: undefined!,
  scrollRestoration: true
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      invalidatesQuery?: QueryKey
      successMessage?: string
      errorMessage?: string
    }
  }
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000
      }
    }
  })
}
let browserQueryClient: QueryClient | undefined = undefined
function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

const createTRPCClientWithAuth = (getToken: () => string | null) => {
  return createTRPCClient<AppRouter>({
    links: [
      loggerLink({
        enabled: (opts) => import.meta.env.DEV || (opts.direction === 'down' && opts.result instanceof Error)
      }),
      httpBatchLink({
        url: config.VITE_API_URL,
        transformer: superjson,
        headers: () => {
          const token = getToken()
          return token ? { Authorization: `Bearer ${token}` } : {}
        }
      })
    ]
  })
}

// Component that runs inside TRPCProvider to fetch user
const AuthInitializer = ({ children }: PropsWithChildren) => {
  const auth = useAuth()
  const hasTriedRefresh = useRef(false)

  // Reset refresh attempt when access token changes
  useEffect(() => {
    if (auth.accessToken) {
      hasTriedRefresh.current = false
    }
  }, [auth.accessToken])

  // Try to refresh token if we have refresh token but no access token
  useEffect(() => {
    if (hasTriedRefresh.current) return

    const tryRefresh = async () => {
      if (!auth.accessToken && auth.refreshToken) {
        hasTriedRefresh.current = true
        try {
          // Create temporary client for refresh
          const tempClient = createTRPCClient<AppRouter>({
            links: [
              httpBatchLink({
                url: config.VITE_API_URL,
                transformer: superjson
              })
            ]
          })

          // Try to refresh token
          const newTokens = await tempClient.auth.refresh.mutate({ refreshToken: auth.refreshToken })

          // Update tokens
          auth.updateToken(newTokens)
          setItemToStorage('ACCESS_TOKEN', newTokens.accessToken)
          setItemToStorage('REFRESH_TOKEN', newTokens.refreshToken)
        } catch {
          // Refresh failed, logout
          auth.updateLoading(false)
          auth.logout()
        }
      } else if (!auth.accessToken && !auth.refreshToken) {
        // No tokens at all, stop loading
        auth.updateLoading(false)
      }
    }

    tryRefresh()
  }, [auth])

  // Fetch current user on mount to validate token
  const {
    data: currentUser,
    isError,
    isFetching
  } = useAuthGetMeQuery({
    enabled: !!auth.accessToken, // Only fetch if we have a token
    retry: false, // Don't retry on 401
    staleTime: Infinity // Don't refetch automatically
  })

  // Manage loading state based on fetch status
  useEffect(() => {
    if (auth.accessToken) {
      auth.updateLoading(isFetching)
    }
  }, [isFetching, auth.accessToken, auth])

  // Update auth state when user is fetched successfully
  useEffect(() => {
    if (currentUser) {
      auth.updateUser(currentUser)
    }
  }, [currentUser, auth])

  // Handle authentication errors - only if no refresh token available
  useEffect(() => {
    if (isError && auth.accessToken) {
      const refreshToken = auth.refreshToken

      // If there's no refresh token, immediately logout
      // Otherwise, let the fetch handler try to refresh
      if (!refreshToken) {
        auth.updateLoading(false)
        auth.logout()
        router.navigate({ to: '/auth/login' })
      }
    }
  }, [isError, auth])

  return <>{children}</>
}

const App = () => {
  const queryClient = getQueryClient()
  const auth = useAuth()

  // Stable reference to getToken function (avoids client recreation)
  const getTokenRef = useRef<() => string | null>(() => auth.accessToken)
  getTokenRef.current = () => auth.accessToken

  // Create tRPC client once (never recreates)
  const trpcClient = useMemo(() => createTRPCClientWithAuth(() => getTokenRef.current()), [])

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <AuthInitializer>
          <RouterProvider router={router} context={{ auth }} />
          <Toaster />
        </AuthInitializer>
      </TRPCProvider>
    </QueryClientProvider>
  )
}

export default App
