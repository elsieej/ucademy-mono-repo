# @elsie/client

Modern React frontend application for the Elsie platform with end-to-end type safety.

## 🚀 Features

- **React 19** - Latest React with improved performance
- **TypeScript** - Type-safe development
- **Vite 7** - Lightning-fast build tool and dev server
- **TanStack Router** - Type-safe file-based routing with smart redirects
- **TanStack Query** - Powerful data fetching and caching
- **tRPC** - End-to-end type-safe APIs with auto token refresh (NEW!)
- **Optimized Client** - Zero-recreation tRPC client with React refs (NEW!)
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI + shadcn/ui** - Accessible and beautiful components
- **Lucide React** - Modern icon library
- **Hot Module Replacement** - Instant updates without page refresh
- **ESLint & Prettier** - Code quality and formatting

## 🏗️ Project Structure

```
src/
├── assets/             # Static assets (images, icons)
├── components/         # Reusable components
│   ├── custom/         # Custom components
│   │   └── header-navigation.component.tsx
│   └── ui/             # shadcn/ui components
├── constants/          # App configuration
│   └── config.ts       # API URL configuration
├── features/           # Feature-based modules
│   ├── auth/           # Authentication features
│   │   ├── login/      # Login feature
│   │   │   └── login-form.component.tsx
│   │   └── register/   # Register feature
│   │       └── register-form.component.tsx
│   └── shared/         # Shared feature components
├── hooks/              # Custom React hooks
│   └── apis/           # API hooks (tRPC wrappers)
│       ├── use-auth.api.ts
│       └── use-health.api.ts
├── lib/                # Utility functions
│   ├── storage.ts      # localStorage utilities
│   ├── trpc.ts         # tRPC client hook
│   └── utils.ts        # General utilities
├── providers/          # React context providers
│   └── auth.provider.tsx  # Authentication context
├── routes/             # File-based routes (TanStack Router)
│   ├── __root.tsx      # Root layout with router context
│   ├── _authenticated/ # Protected routes layout
│   │   ├── route.tsx   # Auth guard with header navigation
│   │   ├── index.tsx   # Home page (protected)
│   │   └── about.tsx   # About page (protected)
│   └── auth/           # Auth routes (login/register)
│       ├── route.tsx   # Auth layout with redirect guard
│       ├── login.tsx   # Login page
│       └── register.tsx # Register page
├── routeTree.gen.ts    # Auto-generated route tree
├── App.tsx             # App component with tRPC & auth initialization
├── main.tsx            # Application entry point
└── index.css           # Global styles (Tailwind CSS)
```

## 🔧 Getting Started

### Prerequisites

- Node.js 22.20.0 (managed via Volta)
- pnpm package manager

### Development

```bash
# Start development server (from package root)
pnpm dev

# Watch and rebuild route tree (optional, runs in background)
pnpm tsr:watch

# Or run from monorepo root (runs all packages)
cd ../.. && pnpm dev
# 🟡 [models] - TypeScript watch mode (auto-rebuilds)
# 🔵 [server] - Express API with hot reload
# 🟢 [client] - Vite dev server with HMR

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint

# Format code
pnpm format
```

## 🔐 Authentication System

Complete JWT-based authentication with the following features:

### Core Features

- ✅ **AuthProvider** - Centralized authentication state management
- ✅ **Protected Routes** - Automatic redirect for unauthenticated users
- ✅ **Auth Route Guards** - Redirects authenticated users away from login/register
- ✅ **No Flash Issues** - Prevents login form from flashing before redirects
- ✅ **Auto Token Refresh** - Seamless token refresh on 401 responses
- ✅ **Smart Redirects** - Preserves original URL when redirecting to login
- ✅ **Header Navigation** - Common navigation component for authenticated users
- ✅ **Storage Utilities** - Type-safe localStorage wrappers
- ✅ **Logout Flow** - Graceful logout with cleanup

### AuthProvider

Central authentication context that manages auth state:

```typescript
// src/providers/auth.provider.tsx
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [user, setUser] = useState<UserResponseSchema | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Auto-load tokens from localStorage on mount
  useEffect(() => {
    const storedAccessToken = getItemFromStorage('accessToken')
    const storedRefreshToken = getItemFromStorage('refreshToken')
    if (storedAccessToken) setAccessToken(storedAccessToken)
    if (storedRefreshToken) setRefreshToken(storedRefreshToken)
    setIsInitialized(true)
  }, [])

  const logout = useCallback(() => {
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)
    removeItemFromStorage('accessToken')
    removeItemFromStorage('refreshToken')
  }, [])

  const isAuthenticated = Boolean(accessToken && user)

  return (
    <AuthContext.Provider value={{
      accessToken, setAccessToken,
      refreshToken, setRefreshToken,
      user, setUser,
      isAuthenticated,
      isLoading, setIsLoading,
      isInitialized,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = use(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

### Protected Routes

Protected routes use the `_authenticated` layout that automatically redirects unauthenticated users:

```typescript
// src/routes/_authenticated/route.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth?.isAuthenticated) {
      // Redirect to login with original URL preserved
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.pathname }
      })
    }
  },
  component: AuthenticatedLayout
})

function AuthenticatedLayout() {
  return (
    <>
      <HeaderNavigation />
      <Outlet />
    </>
  )
}
```

### Auth Route Guards

Auth routes (login/register) redirect authenticated users away:

```typescript
// src/routes/auth/route.tsx
export const Route = createFileRoute('/auth')({
  component: AuthRoute
})

function AuthRoute() {
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect authenticated users away
    if (!auth.isLoading && auth.isAuthenticated) {
      navigate({ to: '/' })
    }
  }, [auth.isAuthenticated, auth.isLoading, navigate])

  // Prevent flash of login form
  if (auth.isLoading || auth.isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p>{auth.isLoading ? 'Checking authentication...' : 'Redirecting...'}</p>
      </div>
    )
  }

  return <Outlet />
}
```

### Storage Utilities

Type-safe localStorage helpers:

```typescript
// src/lib/storage.ts
export const getItemFromStorage = <T = string>(key: string): T | null => {
  const item = localStorage.getItem(key)
  return item ? (item as T) : null
}

export const setItemToStorage = <T = string>(key: string, value: T): void => {
  localStorage.setItem(key, String(value))
}

export const removeItemFromStorage = (key: string): void => {
  localStorage.removeItem(key)
}
```

### Authentication Flow

**Complete Login Flow:**

```
1. User enters credentials
2. Login mutation called
3. Tokens received from server
4. AuthProvider updates state
5. Tokens saved to localStorage
6. User data fetched with getMe query
7. Router redirects to intended page
```

**Complete Logout Flow:**

```
1. User clicks logout
2. auth.logout() called
3. Tokens cleared from state
4. Tokens removed from localStorage
5. User state cleared
6. Router redirects to login
```

**Token Refresh Flow:**

```
1. API request returns 401
2. tRPC client intercepts response
3. Attempts token refresh
4. On success: Updates tokens and retries request
5. On failure: Calls logout and redirects to login
```

### Header Navigation

Common navigation component for authenticated users:

```typescript
// Included in _authenticated layout
<HeaderNavigation />

// Features:
// - Displays current user info
// - Logout button
// - Navigation links
// - Profile dropdown
```

## 🌐 Development Server

The development server runs on **http://localhost:3001** with:

- ⚡ Hot Module Replacement (HMR)
- 🔥 Fast Refresh for React components
- 🎯 Type-checking in the IDE
- 🔄 Auto-updates when `@elsie/models` types change

### Full Stack Development

When running `pnpm dev` from the monorepo root:

- **Client** (3001) - React app with instant HMR
- **Server** (3000) - API with hot reload
- **Models** - TypeScript watch mode for shared types

Changes flow automatically: Models → Server → Client

## 📦 Tech Stack

### Dependencies

- **react** `^19.1.1` - UI library
- **react-dom** `^19.1.1` - React DOM renderer
- **@tanstack/react-router** - Type-safe routing
- **@tanstack/react-query** - Data fetching and caching
- **@trpc/client** - tRPC client for type-safe APIs
- **superjson** - Automatic serialization (Date, Map, Set)
- **tailwindcss** `^4.1.14` - Utility-first CSS
- **@radix-ui/react-slot** - Radix UI primitives
- **lucide-react** - Modern icon library
- **class-variance-authority** - CVA for component variants
- **clsx** & **tailwind-merge** - Class name utilities
- **sonner** - Beautiful toast notifications

### Dev Dependencies

- **vite** - Build tool and dev server
- **@vitejs/plugin-react** - React plugin for Vite
- **@tanstack/router-cli** - TanStack Router CLI
- **@tanstack/router-plugin** - Vite plugin for TanStack Router
- **@types/react** - TypeScript types for React
- **@types/react-dom** - TypeScript types for React DOM
- **tw-animate-css** - Tailwind CSS animations

## 🔗 End-to-End Type Safety with tRPC

The client connects to the backend using **tRPC** for complete type safety with authentication and automatic token refresh.

### tRPC Client with Auto Token Refresh ⚡

The tRPC client includes automatic token refresh on 401 responses:

```typescript
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import type { AppRouter } from '@elsie/server'
import superjson from 'superjson'

const createTRPCClientWithAuth = (
  getToken: () => string | null,
  onTokenRefresh?: (tokens: { accessToken: string; refreshToken: string }) => void,
  onAuthFailure?: () => void
) => {
  return createTRPCClient<AppRouter>({
    links: [
      loggerLink({
        enabled: (opts) => import.meta.env.DEV || opts.result instanceof Error
      }),
      httpBatchLink({
        url: 'http://localhost:3000/trpc',
        transformer: superjson, // Handles Date, Map, Set
        headers: () => {
          const token = getToken()
          return token ? { Authorization: `Bearer ${token}` } : {}
        },
        fetch: async (url, options = {}) => {
          const response = await fetch(url, options)

          // Auto-refresh on 401 (token expired)
          if (response.status === 401 && onTokenRefresh) {
            const refreshToken = localStorage.getItem('refreshToken')
            if (!refreshToken) return response

            try {
              // Refresh tokens
              const tempClient = createTRPCClient<AppRouter>({
                /* ... */
              })
              const newTokens = await tempClient.auth.refresh.mutate({ refreshToken })

              // Update state and retry request
              onTokenRefresh(newTokens)
              return fetch(url, {
                ...options,
                headers: { ...options.headers, Authorization: `Bearer ${newTokens.accessToken}` }
              })
            } catch {
              // Refresh failed - logout
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
```

**Features:**

- ✅ **Automatic refresh** - Intercepts 401 responses and refreshes tokens
- ✅ **Transparent retry** - Retries failed request with new token
- ✅ **Graceful logout** - Redirects to login with original URL on refresh failure
- ✅ **No user intervention** - Completely automatic and transparent

### Client Performance Optimization 🚀

The tRPC client is created once and never recreates, using React refs for stable callbacks:

```typescript
const App = () => {
  const auth = useAuth()

  // Stable refs - update on every render without recreating client
  const getTokenRef = useRef<() => string | null>(() => auth.accessToken)
  getTokenRef.current = () => auth.accessToken

  const onTokenRefreshRef = useRef<(tokens) => void>(() => {})
  onTokenRefreshRef.current = (tokens) => {
    auth.setAccessToken(tokens.accessToken)
    auth.setRefreshToken(tokens.refreshToken)
  }

  const onAuthFailureRef = useRef<() => void>(() => {})
  onAuthFailureRef.current = () => {
    auth.logout()
    router.navigate({ to: '/auth/login', search: { redirect: location.pathname } })
  }

  // Client created ONCE - never recreates (empty deps array)
  const trpcClient = useMemo(
    () => createTRPCClientWithAuth(
      () => getTokenRef.current(),
      (tokens) => onTokenRefreshRef.current?.(tokens),
      () => onAuthFailureRef.current()
    ),
    []
  )

  return <TRPCProvider trpcClient={trpcClient}>...</TRPCProvider>
}
```

**Benefits:**

- ⚡ **Zero recreations** - Client persists for app lifetime
- 🎯 **Latest values** - Refs always access current auth state
- 🔥 **No re-renders** - Empty deps array prevents unnecessary renders
- 📍 **Smart redirects** - Preserves original URL on logout

### Using tRPC with React Query

**Custom Hooks Pattern:**

```typescript
// hooks/apis/use-auth.api.ts
import { useTRPC } from '@/lib/trpc'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useAuthGetMeQuery = (
  queryOptions?: Parameters<ReturnType<typeof useTRPC>['auth']['getMe']['queryOptions']>[0]
) => {
  const trpc = useTRPC()
  return useQuery(trpc.auth.getMe.queryOptions(queryOptions))
}

export const useAuthLoginMutation = (
  mutationOptions?: Parameters<ReturnType<typeof useTRPC>['auth']['login']['mutationOptions']>[0]
) => {
  const trpc = useTRPC()
  return useMutation(trpc.auth.login.mutationOptions(mutationOptions))
}
```

**Usage in Components:**

```typescript
import { useAuthGetMeQuery, useAuthLoginMutation } from '@/hooks/apis/use-auth.api'

function Profile() {
  const { data: user, isLoading } = useAuthGetMeQuery()

  if (isLoading) return <div>Loading...</div>
  return <div>Hello, {user?.name}!</div>
}

function LoginForm() {
  const loginMutation = useAuthLoginMutation({
    onSuccess: (data) => {
      // Save tokens
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    loginMutation.mutate({ email: '...', password: '...' })
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### Benefits

- ✅ **Full type safety** - No manual type definitions needed
- ✅ **Auto-completion** - IDE knows all API endpoints and types
- ✅ **Runtime safety** - Zod validates data at runtime
- ✅ **Instant feedback** - TypeScript errors on API changes
- ✅ **Automatic auth** - Token included in every request
- ✅ **SuperJSON** - Handles Date, Map, Set automatically

## 🏗️ Building for Production

```bash
# Build the application
pnpm build

# Preview the production build locally
pnpm preview
```

The build output will be in the `dist/` directory, optimized and ready for deployment.

## 📝 TypeScript Configuration

The project uses a dual tsconfig setup:

- **tsconfig.app.json** - Configuration for application code (`src/`)
- **tsconfig.node.json** - Configuration for build tools (`vite.config.ts`)
- **tsconfig.json** - Root config that references both

This allows proper type-checking for both your app code and build configuration.

### Importing Server Types

The client imports the `AppRouter` type from `@elsie/server` for end-to-end type safety:

```typescript
import type { AppRouter } from '@elsie/server'
```

**Requirements:**

1. `@elsie/server` must be listed in `package.json` dependencies
2. The server source files must be accessible via TypeScript path mappings
3. `tsconfig.app.json` must extend the base config to resolve `@elsie/*` path mappings:
   ```json
   {
     "paths": {
       "@elsie/*": ["packages/*/src"]
     }
   }
   ```

**How it works:**

- The client imports types directly from the server's **source files** (not built `.d.ts` files)
- TypeScript uses path mappings to resolve `@elsie/server` → `packages/server/src`
- No need to build the server for type checking (faster development!)

**Note:** Use `import type` (not `import`) to ensure only types are imported at compile-time, preventing server code from bundling into the client.

## 🎨 Styling with Tailwind CSS v4

The project uses **Tailwind CSS v4** with the new Vite plugin:

```tsx
import { Button } from '@/components/ui/button'

function MyComponent() {
  return (
    <div className='flex items-center gap-4 p-4'>
      <Button variant='default'>Click me</Button>
      <Button variant='outline'>Cancel</Button>
    </div>
  )
}
```

### Features

- ✅ **Tailwind CSS v4** - Latest version with Vite plugin
- ✅ **shadcn/ui components** - Pre-built accessible components
- ✅ **Radix UI primitives** - Unstyled, accessible components
- ✅ **CVA** - Component variants with type safety
- ✅ **Custom animations** - Via tw-animate-css

## 🛣️ Routing with TanStack Router

File-based routing with full type safety and context.

### Root Route with Context

```tsx
// src/routes/__root.tsx
import { createRootRouteWithContext } from '@tanstack/react-router'

type RouterContext = {
  auth: AuthState
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
})
```

### Router Setup

```tsx
// src/App.tsx
const router = createRouter({
  routeTree,
  context: undefined!
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const App = () => {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}
```

### Protected Routes

```tsx
// src/routes/auth/login.tsx
export const Route = createFileRoute('/auth/login')({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/'
  }),
  beforeLoad: ({ context, search }) => {
    // Redirect if already authenticated
    if (context.auth?.isAuthenticated) {
      throw redirect({ to: search.redirect })
    }
  },
  component: LoginPage
})
```

### Route Tree Generation

Routes are automatically generated from the file structure:

**Root & Context:**

- `src/routes/__root.tsx` → Root layout with auth context

**Public Routes (Auth):**

- `src/routes/auth/route.tsx` → `/auth` (layout with redirect guard)
- `src/routes/auth/login.tsx` → `/auth/login`
- `src/routes/auth/register.tsx` → `/auth/register`

**Protected Routes (Authenticated):**

- `src/routes/_authenticated/route.tsx` → `/_authenticated` (protected layout)
- `src/routes/_authenticated/index.tsx` → `/` (home page)
- `src/routes/_authenticated/about.tsx` → `/about`

Run `pnpm tsr:watch` during development for auto-generation.

**Route Naming Conventions:**

- `_authenticated/` → Protected routes prefix (requires authentication)
- `auth/` → Public auth routes (login/register)
- `route.tsx` → Layout route
- `index.tsx` → Index route for that path

### Naming Conventions

- **Routes**: `kebab-case` (e.g., `auth/login.tsx`)
- **Components**: `kebab-case.component.tsx` (e.g., `login-form.component.tsx`)
- **Providers**: `kebab-case.provider.tsx` (e.g., `auth.provider.tsx`)

## 📦 Updating Dependencies

### Interactive Update (Recommended)

```bash
# From client package
pnpm update --interactive --latest

# From monorepo root
pnpm -F @elsie/client update --interactive --latest
```

### Update Specific Packages

```bash
# Update TanStack packages
pnpm update "@tanstack/*" --latest

# Update React
pnpm update react react-dom --latest

# Update Tailwind CSS
pnpm update tailwindcss @tailwindcss/vite --latest
```

See [root README](../../README.md#-updating-dependencies) for more details.

## 🧪 Testing (Future)

Recommended testing setup:

- **Vitest** - Fast unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

## 🚢 Deployment

The built application is static and can be deployed to:

- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront
- Any static hosting provider

## 🔗 Related Packages

- **@elsie/models** - Shared types and validation schemas
- **@elsie/server** - Backend API server

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
