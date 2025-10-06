# @elsie/server

Express.js backend API server with tRPC for the Elsie platform.

## 🚀 Features

- **Express 5** - Modern Node.js web framework
- **tRPC** - End-to-end type-safe APIs with protected procedures
- **TypeScript** - Type-safe development with branded types
- **PostgreSQL** - Database with Drizzle ORM
- **Drizzle Kit** - Database migrations and seeding
- **Pino** - High-performance structured logging
- **JWT Authentication** - Access & refresh token auth flow
- **User Caching** - In-memory caching for 10-50x faster auth (NEW!)
- **Zod** - Runtime validation for env and data
- **CORS** - Cross-origin resource sharing
- **SuperJSON** - Automatic serialization of Date, Map, Set
- **Hot Reload** - Fast development with tsx watch mode

## 🏗️ Project Structure

```
src/
├── constants/              # Configuration
│   ├── config.ts           # Environment variables with Zod validation
│   ├── drizzle-migrate.config.ts  # Migration configuration
│   └── drizzle-seed.config.ts     # Seed configuration
├── db/                     # Database layer
│   ├── columns.helper.ts   # Reusable column definitions
│   └── schema/             # Drizzle ORM schemas
│       └── users.schema.ts
├── lib/                    # Shared libraries
│   ├── db.ts               # Database connection (Drizzle + PostgreSQL)
│   └── pino.ts             # Logging configuration
├── trpc/                   # tRPC setup
│   ├── context.ts          # Request context with auth & caching
│   ├── trpc.ts             # tRPC instance, public & protected procedures
│   ├── services/           # Business logic layer
│   │   ├── auth.service.ts # Authentication service
│   │   ├── users.service.ts # User service
│   │   └── token.service.ts # JWT token service
│   └── routers/            # tRPC routers
│       ├── index.ts        # Root router
│       ├── auth.router.ts  # Auth endpoints (register, login, refresh, getMe)
│       ├── health.router.ts # Health check endpoint
│       └── users.router.ts # User endpoints
├── utils/                  # Utility functions
│   ├── errors.ts           # Error handling utilities
│   ├── jwt.ts              # JWT token utilities
│   ├── try-catch.ts        # Promise error handling wrapper
│   └── user-cache.ts       # In-memory user caching (NEW!)
├── index.ts                # Application entry point
└── type.d.ts               # Global type definitions
```

## 🔧 Getting Started

### Prerequisites

- Node.js 22.20.0 (managed via Volta)
- PostgreSQL database
- pnpm package manager

### Environment Setup

Create a `.env` file in the package root:

```env
# Server
PORT=3000
CORS_ORIGIN=http://localhost:3001
NODE_ENV=development

# Database
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name

# JWT
JWT_ACCESS_TOKEN_SECRET=your_access_secret
JWT_ACCESS_TOKEN_EXPIRED=15m
JWT_REFRESH_TOKEN_SECRET=your_refresh_secret
JWT_REFRESH_TOKEN_EXPIRED=7d
```

### Development

```bash
# Start development server with hot reload (from package root)
pnpm dev

# Database operations
pnpm db:migrate:generate  # Generate migration files
pnpm db:migrate:up        # Apply migrations
pnpm db:seed:generate     # Generate seed files
pnpm db:seed:up          # Apply seeds

# Or run from monorepo root (runs all packages)
cd ../.. && pnpm dev
# 🟡 [models] - TypeScript watch mode (auto-rebuilds)
# 🔵 [server] - Express API with hot reload
# 🟢 [client] - Vite dev server with HMR

# Build for production
pnpm build

# Lint code
pnpm lint

# Format code
pnpm format
```

## 🔄 Hot Reload

The server uses `tsx --watch` which automatically:

- ✅ Restarts the server when source files change
- ✅ Preserves output for easier debugging
- ✅ Picks up changes from `@elsie/models` automatically

No need to manually restart or rebuild during development!

## 📦 Tech Stack

### Dependencies

- **express** `^5.1.0` - Web framework
- **@trpc/server** `^11.6.0` - tRPC server
- **cors** - CORS middleware
- **drizzle-orm** `^0.44.6` - TypeScript ORM
- **pg** - PostgreSQL client
- **pino** `^10.0.0` - Structured logging
- **pino-pretty** - Pretty logging in development
- **jsonwebtoken** - JWT implementation
- **dotenv** - Environment variable loader
- **@elsie/models** - Shared types and schemas

### Dev Dependencies

- **tsx** `^4.20.6` - TypeScript execution and watch mode
- **drizzle-kit** `^0.31.5` - Database migrations and introspection
- **tsc-alias** `^1.8.16` - Path alias resolution for compiled output
- **@types/\*** - TypeScript type definitions

## ⚡ Performance Optimizations

### User Context Caching

The server implements in-memory user caching to reduce database load:

- **Cache Hit:** ~1ms (Map lookup)
- **Cache Miss:** 10-50ms (PostgreSQL query)
- **TTL:** 60 seconds
- **Cleanup:** Every 5 minutes

**When to invalidate cache:**

```typescript
import { userCache } from '@/utils/user-cache'

// After updating user data
await userService.update(userId, data)
userCache.invalidate(userId)

// Clear all cached users
userCache.clear()
```

**Cache startup:**

```typescript
// src/index.ts
import { userCache } from './utils/user-cache'

// Start automatic cleanup
userCache.startCleanup()

httpServer.listen(port, () => {
  logger.info({ port }, `[SERVER] is running on port ${port}`)
})
```

## 🗄️ Database with Drizzle ORM

This server uses **Drizzle ORM** with PostgreSQL for type-safe database queries.

### Database Connection

```typescript
import { db } from './libs/db'

// Type-safe queries
const users = await db.query.users.findMany()
```

### Migrations

```bash
# Generate migration from schema changes
pnpm generate:migration

# Apply migrations
drizzle-kit push
```

### Schema Definition

```typescript
// src/db/schema/users.schema.ts
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow()
})
```

## 🔗 tRPC Integration

The server uses **tRPC** for end-to-end type-safe APIs with authentication.

### Public Procedures

Available to everyone without authentication:

```typescript
// src/trpc/routers/auth.router.ts
import { publicProcedure, router } from '../trpc'

export const authRouter = router({
  register: publicProcedure
    .input(userRegisterDto)
    .output(userRegisterResponseSchema)
    .mutation(({ input }) => {
      return authService.register(input)
    }),
  login: publicProcedure
    .input(userLoginDto)
    .output(userLoginResponseSchema)
    .mutation(({ input }) => {
      return authService.login(input)
    })
})
```

### Protected Procedures

Require authentication (JWT token in Authorization header):

```typescript
// src/trpc/routers/auth.router.ts
import { protectedProcedure, router } from '../trpc'

export const authRouter = router({
  getMe: protectedProcedure.output(userResponseSchema).query(({ ctx }) => {
    return ctx.user // User is guaranteed to exist
  })
})
```

### Auth Middleware

```typescript
// src/trpc/trpc.ts
const authMiddleware = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    })
  }
  return next({ ctx: { ...ctx, user: ctx.user } })
})

export const protectedProcedure = t.procedure.use(authMiddleware)
```

### Context with Authentication & Caching 🚀

The context automatically loads the user from the JWT token with **in-memory caching** for optimal performance:

```typescript
// src/trpc/context.ts
export const createContext = async (opts: CreateExpressContextOptions) => {
  const context = { req: opts.req, res: opts.res, user: null }

  const authHeader = opts.req.headers.authorization
  if (!authHeader) return context

  const token = authHeader.split(' ')[1]
  const decoded = verifyAccessToken(token)
  if (!decoded) return context

  // Try to get user from cache first (1ms lookup)
  const cachedUser = userCache.get(decoded.userId)
  if (cachedUser) {
    context.user = cachedUser
    return context
  }

  // Cache miss - fetch from database (10-50ms)
  const user = await userService.findById(decoded.userId)
  if (user) {
    userCache.set(decoded.userId, user)
    context.user = user
  }

  return context
}
```

**User Cache Implementation:**

```typescript
// src/utils/user-cache.ts
class UserCache {
  private cache: Map<UserId, CachedUser> = new Map()
  private readonly TTL = 60000 // 1 minute

  get(userId: UserId): UserResponseSchema | null {
    const cached = this.cache.get(userId)
    if (!cached) return null

    // Check if expired
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(userId)
      return null
    }

    return cached.user
  }

  set(userId: UserId, user: UserResponseSchema): void {
    this.cache.set(userId, { user, timestamp: Date.now() })
  }

  invalidate(userId: UserId): void {
    this.cache.delete(userId)
  }

  // Automatic cleanup every 5 minutes
  startCleanup(interval: number = 5 * 60 * 1000): NodeJS.Timeout {
    return setInterval(() => {
      const now = Date.now()
      for (const [userId, cached] of this.cache.entries()) {
        if (now - cached.timestamp > this.TTL) {
          this.cache.delete(userId)
        }
      }
    }, interval)
  }
}
```

**Performance Benefits:**

| Metric                | Before             | After              |
| --------------------- | ------------------ | ------------------ |
| Auth context creation | 10-50ms (DB query) | 1ms (cache hit)    |
| Database load         | Every request      | Only on cache miss |
| Response time         | Slower             | 10-50x faster      |

**Cache Features:**

- ✅ **1-minute TTL** - Balances performance and data freshness
- ✅ **Automatic cleanup** - Expires old entries every 5 minutes
- ✅ **Invalidation support** - Manual cache clearing when user data changes
- ✅ **Zero config** - Starts automatically on server boot

### Client Usage with Auth

```typescript
// Client side
const result = await trpc.auth.getMe.query()
// Automatically includes Authorization header
```

## 📝 Logging with Pino

Structured logging with **Pino** for high performance:

```typescript
import { logger } from './libs/pino'

logger.info('Server started')
logger.error({ err }, 'Database connection failed')
logger.debug({ userId: '123' }, 'User logged in')
```

## 🔐 Authentication

JWT-based authentication with access and refresh tokens:

- **Access Token** - Short-lived token for API requests (15 minutes default)
- **Refresh Token** - Long-lived token for renewing access (7 days default)

### Authentication Flow

```
1. Register/Login → Receive access + refresh tokens
2. Store tokens in client (localStorage/memory)
3. Include access token in Authorization header
4. When access token expires → Use refresh token to get new tokens
5. Logout → Clear tokens
```

### Endpoints

**Public Endpoints:**

- `auth.register` - Create new account
- `auth.login` - Login with email/password
- `auth.refresh` - Refresh access token

**Protected Endpoints:**

- `auth.getMe` - Get current user profile
- `users.*` - All user management endpoints

### Token Verification

```typescript
// Automatic in context
const decoded = verifyAccessToken(token) // Returns TokenPayload or null
const user = await userService.findById(decoded.userId)
ctx.user = user // Available in all protected procedures
```

Configuration is validated via `@elsie/models/serverConfigSchema`.

## 🌐 tRPC Endpoints

The tRPC API is available at `http://localhost:3000/trpc`.

### Available Procedures

**Health**

- `health.check` - Health check with database status

**Authentication (Public)**

- `auth.register` - Register new user
- `auth.login` - Login with email/password
- `auth.refresh` - Refresh access token

**Authentication (Protected)**

- `auth.getMe` - Get current user profile

**Users (Protected)**

- More endpoints coming soon...

### Request Format

```typescript
// Public endpoint
POST /trpc/auth.login
{
  "email": "user@example.com",
  "password": "password123"
}

// Protected endpoint (requires Authorization header)
GET /trpc/auth.getMe
Headers: { Authorization: "Bearer <access_token>" }
```

CORS is configured to accept requests from the configured origin (default: client app).

## 🏃 Running in Production

```bash
# Build the application
pnpm build

# Start production server
node dist/index.js
```

Make sure all environment variables are properly set in production.

### Build Configuration

The server uses `tsconfig.build.json` for production builds:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false, // Enable JavaScript output
    "outDir": "dist", // Output directory
    "rootDir": "src", // Source directory
    "declaration": false, // Skip .d.ts generation (faster builds)
    "sourceMap": true, // Generate source maps for debugging
    "skipLibCheck": true // Skip type checking of declaration files
  }
}
```

**Build Process:**

```bash
# 1. Compile TypeScript to JavaScript
tsc -p tsconfig.build.json

# 2. Resolve path aliases (@/* → actual paths)
tsc-alias -p tsconfig.build.json
```

**Build Output:**

- JavaScript files: `dist/**/*.js`
- Source maps: `dist/**/*.js.map`

**Note:** The build doesn't automatically clean the `dist` folder. To manually clean:

```bash
# Windows
rmdir /s /q dist

# Linux/Mac
rm -rf dist
```

## 📦 Updating Dependencies

### Interactive Update (Recommended)

```bash
# From server package
pnpm update --interactive --latest

# From monorepo root
pnpm -F @elsie/server update --interactive --latest
```

### Update Specific Packages

```bash
# Update tRPC
pnpm update @trpc/server --latest

# Update Drizzle
pnpm update drizzle-orm drizzle-kit --latest

# Update Express
pnpm update express --latest
```

See [root README](../../README.md#-updating-dependencies) for more details.

## 🔗 Related Packages

- **@elsie/models** - Shared types and validation schemas
- **@elsie/client** - Frontend application
