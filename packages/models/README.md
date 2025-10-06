# @elsie/models

Shared TypeScript models, schemas, and configuration types for the Elsie monorepo.

## 📦 What's Inside

This package provides:

- **Zod Schemas** - Runtime validation and type inference
- **TypeScript Types** - Shared types across client and server
- **Config Schemas** - Environment variable validation
- **DTOs** - Data Transfer Objects for API requests
- **Response Schemas** - Type-safe API responses
- **Branded Types** - Type-safe IDs (UserId, etc.)

## 🏗️ Structure

```
src/
├── apis/                  # API-related schemas
│   ├── dto/               # Data Transfer Objects
│   │   ├── auth.dto.ts    # Auth request DTOs
│   │   └── user.dto.ts    # User request DTOs
│   ├── response/          # API response schemas
│   │   └── auth.response.ts  # Auth response schemas
│   └── index.ts
├── configs/               # Configuration schemas
│   ├── client.config.ts   # Client environment validation
│   └── server.config.ts   # Server environment validation
├── schema/                # Domain models
│   ├── user.schema.ts     # User model with branded ID
│   └── index.ts
├── utils/                 # Utility functions
│   └── id-brand.ts        # Branded type helper
└── index.ts               # Main exports
```

## 📚 Usage

### In Server Package

```typescript
import { serverConfigSchema, userRegisterDto, userRegisterResponseSchema, UserId } from '@elsie/models'

// Validate environment variables
const config = serverConfigSchema.parse(process.env)

// Validate request body
const input = userRegisterDto.parse(req.body)

// Type-safe user ID
const userId: UserId = user.id as UserId
```

### In Client Package

```typescript
import { type UserRegisterDto, type UserRegisterResponseSchema, type TokenPayloadSchema } from '@elsie/models'

// Type-safe request
const registerData: UserRegisterDto = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
}

// Type-safe response
const response: UserRegisterResponseSchema = await trpc.auth.register.mutate(registerData)
```

## 🔧 Available Schemas

### Authentication DTOs

**Register:**

```typescript
{
  name: string
  email: string
  password: string
}
```

**Login:**

```typescript
{
  email: string
  password: string
}
```

**Refresh:**

```typescript
{
  refreshToken: string
}
```

### Response Schemas

**Register/Login Response:**

```typescript
{
  accessToken: string
  refreshToken: string
  user: {
    id: UserId // Branded type
    name: string
    email: string
    createdAt: Date
    updatedAt: Date | null
    deletedAt: Date | null
  }
}
```

**Token Response:**

```typescript
{
  accessToken: string
  refreshToken: string
}
```

**Token Payload:**

```typescript
{
  userId: UserId // Branded type
  email: string
}
```

### Branded Types

**UserId:**

```typescript
import { zIdBrand } from '@/utils/id-brand'

const userId = zIdBrand('UserId') // z.string().uuid().brand<'UserId'>()
type UserId = z.infer<typeof userId>
```

Benefits:

- ✅ Type-safe - Can't mix up different ID types
- ✅ Runtime validated - Ensures valid UUID format
- ✅ Self-documenting - Clear intent in type signatures

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

**Build Process:**

```bash
# 1. Compile TypeScript to JavaScript
tsc -p tsconfig.build.json

# 2. Resolve path aliases (@/* → actual paths)
tsc-alias -p tsconfig.build.json
```

**Important:**

- `noEmit: false` is required to generate JavaScript files
- `tsc-alias` resolves path aliases like `@/schema` → `../../schema` in the output
- Without path resolution, imports will fail when used by other packages

## 🔄 Watch Mode

The models package includes TypeScript watch mode for development:

```bash
pnpm dev
```

This automatically rebuilds the package whenever you make changes to source files. When running `pnpm dev` at the root level, models watch mode runs alongside the server and client, ensuring type changes are immediately available.

## 📦 Dependencies

- **zod** - Schema validation and type inference

### Dev Dependencies

- **tsc-alias** `^1.8.16` - Path alias resolution for compiled output

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
