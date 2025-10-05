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
# Development with watch mode (auto-rebuilds on changes)
pnpm dev

# Build the package once
pnpm build

# Lint code
pnpm lint

# Format code
pnpm format
```

### Build Output

The build process uses `tsconfig.build.json` with the following configuration:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false, // Enable JavaScript output
    "outDir": "dist", // Output directory
    "rootDir": "src", // Source directory
    "declaration": true, // Generate .d.ts files
    "declarationMap": true, // Generate .d.ts.map files
    "composite": true // Enable project references
  }
}
```

**Important:** `noEmit: false` is required to generate JavaScript files. Without it, TypeScript only performs type-checking.

## 🔄 Watch Mode

The models package includes TypeScript watch mode for development:

```bash
pnpm dev
```

This automatically rebuilds the package whenever you make changes to source files. When running `pnpm dev` at the root level, models watch mode runs alongside the server and client, ensuring type changes are immediately available.

## 📦 Dependencies

- **zod** - Schema validation and type inference

## 📦 Updating Dependencies

### Interactive Update (Recommended)

```bash
# From models package
pnpm update --interactive --latest

# From monorepo root
pnpm -F @elsie/models update --interactive --latest
```

### Update Zod

```bash
pnpm update zod --latest
```

See [root README](../../README.md#-updating-dependencies) for more details.

## 🔗 Used By

- `@elsie/server` - Backend API
- `@elsie/client` - Frontend application
