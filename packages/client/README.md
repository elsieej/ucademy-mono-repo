# @elsie/client

Modern React frontend application for the Elsie platform with end-to-end type safety.

## 🚀 Features

- **React 19** - Latest React with improved performance
- **TypeScript** - Type-safe development
- **Vite 7** - Lightning-fast build tool and dev server
- **TanStack Router** - Type-safe file-based routing
- **TanStack Query** - Powerful data fetching and caching
- **tRPC** - End-to-end type-safe APIs
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
│   └── ui/             # shadcn/ui components
├── constants/          # App configuration
├── features/           # Feature-based modules
│   ├── auth/           # Authentication features
│   │   ├── login/      # Login feature
│   │   └── register/   # Register feature
│   └── shared/         # Shared feature components
├── lib/                # Utility functions
├── providers/          # React context providers
│   └── auth.provider.tsx  # Authentication context
├── routes/             # File-based routes (TanStack Router)
│   ├── __root.tsx      # Root layout with context
│   ├── auth/           # Auth routes
│   │   ├── route.tsx   # Auth layout
│   │   ├── login.tsx   # Login page
│   │   └── register.tsx # Register page
│   ├── index.tsx       # Home page
│   └── about.tsx       # About page
├── routeTree.gen.ts    # Auto-generated route tree
├── App.tsx             # App component with router
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
- **tailwindcss** `^4.1.14` - Utility-first CSS
- **@radix-ui/react-slot** - Radix UI primitives
- **lucide-react** - Modern icon library
- **class-variance-authority** - CVA for component variants
- **clsx** & **tailwind-merge** - Class name utilities

### Dev Dependencies

- **vite** - Build tool and dev server
- **@vitejs/plugin-react** - React plugin for Vite
- **@tanstack/router-cli** - TanStack Router CLI
- **@tanstack/router-plugin** - Vite plugin for TanStack Router
- **@types/react** - TypeScript types for React
- **@types/react-dom** - TypeScript types for React DOM
- **tw-animate-css** - Tailwind CSS animations

## 🔗 End-to-End Type Safety with tRPC

The client connects to the backend using **tRPC** for complete type safety:

### Setup tRPC Client

```typescript
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@elsie/server'

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc'
    })
  ]
})
```

### Using tRPC with React Query

```typescript
import { useQuery } from '@tanstack/react-query'

function HealthCheck() {
  const { data, isLoading } = useQuery({
    queryKey: ['health'],
    queryFn: () => trpc.health.check.query()
  })

  if (isLoading) return <div>Loading...</div>
  return <div>Status: {data?.status}</div>
}
```

### Benefits

- ✅ **Full type safety** - No manual type definitions needed
- ✅ **Auto-completion** - IDE knows all API endpoints and types
- ✅ **Runtime safety** - Zod validates data at runtime
- ✅ **Instant feedback** - TypeScript errors on API changes

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

- `src/routes/__root.tsx` → Root layout with context
- `src/routes/index.tsx` → `/`
- `src/routes/auth/route.tsx` → `/auth` (layout)
- `src/routes/auth/login.tsx` → `/auth/login`
- `src/routes/auth/register.tsx` → `/auth/register`

Run `pnpm tsr:watch` during development for auto-generation.

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
