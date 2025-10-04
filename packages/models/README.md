# @elsie/models

Shared TypeScript models, schemas, and configuration types for the Elsie monorepo.

## 📦 What's Inside

This package provides:

- **Zod Schemas** - Runtime validation and type inference
- **TypeScript Types** - Shared types across client and server
- **Config Schemas** - Environment variable validation

## 🏗️ Structure

```
src/
├── configs/          # Configuration schemas
│   └── server.config.ts  # Server environment validation
├── courses/          # Course data models
│   └── index.ts
└── index.ts          # Main exports
```

## 📚 Usage

### In Server Package

```typescript
import { serverConfigSchema, type ServerConfig } from '@elsie/models'

// Validate environment variables
const config = serverConfigSchema.parse(process.env)
```

### In Client Package

```typescript
import { type Course } from '@elsie/models'

const course: Course = {
  id: '1',
  title: 'Introduction to TypeScript',
  description: 'Learn TypeScript basics',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}
```

## 🔧 Available Schemas

### Server Config Schema

Validates server environment variables:

```typescript
{
  port: number
  corsOrigin: string
  dbUser: string
  dbPassword: string
  dbHost: string
  dbPort: number
  dbName: string
  jwtAccessTokenExpired: string
  jwtAccessTokenSecret: string
  jwtRefreshTokenExpired: string
  jwtRefreshTokenSecret: string
  nodeEnv: 'development' | 'production'
}
```

### Course Model

```typescript
{
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}
```

## 🛠️ Scripts

```bash
# Build the package
pnpm build

# Lint code
pnpm lint

# Format code
pnpm format
```

## 📦 Dependencies

- **zod** - Schema validation and type inference

## 🔗 Used By

- `@elsie/server` - Backend API
- `@elsie/client` - Frontend application
