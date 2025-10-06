import { createRouter, RouterProvider, useLocation } from '@tanstack/react-router'
import { useAuth } from './providers/auth.provider'
// Import the generated route tree
import { Toaster } from '@/components/ui/sonner'
import type { AppRouter } from '@elsie/server'
import { QueryClient, QueryClientProvider, type QueryKey } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import { useMemo, useRef } from 'react'
import superjson from 'superjson'
import { config } from './constants/config'
import { TRPCProvider } from './lib/trpc'
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: undefined!
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

const createTRPCClientWithAuth = (
  getToken: () => string | null,
  onTokenRefresh?: (tokens: { accessToken: string; refreshToken: string }) => void,
  onAuthFailure?: () => void
) => {
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
        },
        fetch: async (url, options = {}) => {
          const response = await fetch(url, options)

          // Handle 401 - Token expired
          if (response.status === 401 && onTokenRefresh) {
            const refreshToken = localStorage.getItem('refreshToken')
            if (!refreshToken) {
              // No refresh token, redirect to login
              return response
            }

            try {
              // Create temporary client for refresh (without auth)
              const tempClient = createTRPCClient<AppRouter>({
                links: [
                  httpBatchLink({
                    url: config.VITE_API_URL,
                    transformer: superjson
                  })
                ]
              })

              // Try to refresh token
              const newTokens = await tempClient.auth.refresh.mutate({ refreshToken })

              // Update tokens
              onTokenRefresh(newTokens)
              localStorage.setItem('accessToken', newTokens.accessToken)
              localStorage.setItem('refreshToken', newTokens.refreshToken)

              // Retry original request with new token
              return fetch(url, {
                ...options,
                headers: {
                  ...options.headers,
                  Authorization: `Bearer ${newTokens.accessToken}`
                }
              })
            } catch {
              // Refresh failed, clear tokens and trigger logout
              onAuthFailure?.()
              return response
            }
          }

          return response
        }
      })
    ]
  })
}

const App = () => {
  const location = useLocation()
  const queryClient = getQueryClient()
  const auth = useAuth()

  // Stable reference to getToken function (avoids client recreation)
  const getTokenRef = useRef<() => string | null>(() => auth.accessToken)
  getTokenRef.current = () => auth.accessToken

  // Stable reference to token refresh callback
  const onTokenRefreshRef = useRef<(tokens: { accessToken: string; refreshToken: string }) => void>(() => {})
  onTokenRefreshRef.current = (tokens) => {
    // Update auth state with new tokens
    auth.setAccessToken(tokens.accessToken)
    auth.setRefreshToken(tokens.refreshToken)
  }

  // Stable reference to auth failure callback
  const onAuthFailureRef = useRef<() => void>(() => {})
  onAuthFailureRef.current = () => {
    auth.logout()
    router.navigate({ to: '/auth/login', search: { redirect: location.pathname } })
  }

  // Create tRPC client once (never recreates)
  const trpcClient = useMemo(
    () =>
      createTRPCClientWithAuth(
        () => getTokenRef.current(),
        (tokens) => onTokenRefreshRef.current?.(tokens),
        () => onAuthFailureRef.current()
      ),
    []
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <RouterProvider router={router} context={{ auth }} />
        <Toaster />
      </TRPCProvider>
    </QueryClientProvider>
  )
}

export default App
