# @elsie/server

Express.js backend API server with tRPC for the Elsie platform.

## 🚀 Features

- **Express 5** - Modern Node.js web framework
- **tRPC** - End-to-end type-safe APIs
- **TypeScript** - Type-safe development
- **PostgreSQL** - Database with Drizzle ORM
- **Drizzle Kit** - Database migrations and seeding
- **Pino** - High-performance structured logging
- **JWT Authentication** - Secure token-based auth
- **Zod** - Runtime validation for env and data
- **CORS** - Cross-origin resource sharing
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
├── libs/                   # Shared libraries
│   ├── db.ts               # Database connection (Drizzle + PostgreSQL)
│   └── pino.ts             # Logging configuration
├── trpc/                   # tRPC setup
│   ├── context.ts          # Request context
│   ├── trpc.ts             # tRPC instance and procedures
│   └── routers/            # tRPC routers
│       ├── index.ts        # Root router
│       └── health.ts       # Health check endpoint
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

# Generate database migrations
pnpm generate:migration

# Generate database seed files
pnpm generate:seed

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
- **tsc-alias** - Path alias resolution
- **rimraf** - Cross-platform file deletion
- **@types/\*** - TypeScript type definitions

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

The server uses **tRPC** for end-to-end type-safe APIs.

### Creating Procedures

```typescript
// src/trpc/routers/health.ts
import { publicProcedure, router } from '../trpc'

export const healthRouter = router({
  check: publicProcedure.query(() => {
    return { status: 'ok' }
  })
})
```

### Root Router

```typescript
// src/trpc/routers/index.ts
import { router } from '../trpc'
import { healthRouter } from './health'

export const appRouter = router({
  health: healthRouter
})

export type AppRouter = typeof appRouter
```

### Client Usage

The client can now call this with full type safety:

```typescript
// Client side
const result = await trpc.health.check.query()
// result is typed as { status: string }
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

- **Access Token** - Short-lived token for API requests
- **Refresh Token** - Long-lived token for renewing access

Configuration is validated via `@elsie/models/serverConfigSchema`.

## 🌐 tRPC Endpoints

The tRPC API is available at `http://localhost:3000/trpc`.

### Available Procedures

- `health.check` - Health check endpoint

CORS is configured to accept requests from the configured origin (default: client app).

## 🏃 Running in Production

```bash
# Build the application
pnpm build

# Start production server
node dist/index.js
```

Make sure all environment variables are properly set in production.

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
