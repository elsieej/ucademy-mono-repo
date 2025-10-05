# Elsie Monorepo

A modern full-stack TypeScript monorepo for the Elsie platform, featuring a React frontend, Express backend, and shared type-safe models.

## 🏗️ Architecture

This monorepo uses **pnpm workspaces** to manage multiple packages with shared dependencies and type safety across the entire stack.

```
elsie-monorepo/
├── packages/
│   ├── client/          # React + Vite frontend
│   ├── server/          # Express + PostgreSQL backend
│   └── models/          # Shared TypeScript types & Zod schemas
├── .husky/              # Git hooks
├── eslint.config.mjs    # ESLint flat config
└── tsconfig.base.json   # Shared TypeScript config
```

## 📦 Packages

### [@elsie/client](./packages/client)
Modern React 19 frontend with type-safe routing and API integration.

- **Port:** `http://localhost:3001`
- **Tech:** React, TypeScript, Vite, TanStack Router, TanStack Query, tRPC, Tailwind CSS
- **Features:** File-based routing, Type-safe APIs, React Query caching, Hot Module Replacement

### [@elsie/server](./packages/server)
Express 5 backend API with tRPC and PostgreSQL database.

- **Port:** `http://localhost:3000`
- **Tech:** Express, PostgreSQL, Drizzle ORM, tRPC, Pino, JWT
- **Features:** End-to-end type safety, Database migrations, Structured logging, JWT authentication

### [@elsie/models](./packages/models)
Shared types, schemas, and configurations.

- **Tech:** Zod for runtime validation
- **Exports:** TypeScript types, Zod schemas, config validators
- **Used by:** Both client and server

## 🚀 Quick Start

### Prerequisites

- **Node.js:** 22.20.0 (managed via Volta)
- **pnpm:** Latest version
- **PostgreSQL:** Running instance (or use Docker)
- **Docker & Docker Compose:** (Optional) For containerized development

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd elsie-monorepo

# Install all dependencies
pnpm install

# Setup environment variables
cp packages/server/.env.example packages/server/.env
# Edit packages/server/.env with your configuration

# Option 1: Start PostgreSQL with Docker (recommended)
docker-compose up postgres -d

# Option 2: Use your local PostgreSQL installation
# Make sure PostgreSQL is running and update .env accordingly
```

### Development

```bash
# Run all packages concurrently (models, server, client)
pnpm dev
# 🟡 [models] - TypeScript watch mode (auto-rebuilds)
# 🔵 [server] - Express API with hot reload
# 🟢 [client] - Vite dev server with HMR

# Run individually
pnpm -F @elsie/models dev    # TypeScript watch mode
pnpm -F @elsie/server dev    # Server with hot reload
pnpm -F @elsie/client dev    # Client with HMR

# Build all packages
pnpm build

# Lint all packages
pnpm lint

# Format all packages
pnpm format
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite 7** - Build tool
- **TypeScript** - Type safety
- **TanStack Router** - Type-safe file-based routing
- **TanStack Query** - Data fetching and caching
- **tRPC** - End-to-end type-safe APIs
- **Tailwind CSS v4** - Utility-first CSS
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful component library
- **Lucide React** - Icon library

### Backend
- **Express 5** - Web framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Type-safe database queries with migrations
- **tRPC** - End-to-end type-safe APIs
- **Pino** - High-performance logging
- **JWT** - Authentication

### Shared
- **TypeScript** - Language
- **Zod** - Schema validation
- **pnpm** - Package manager

### Tooling
- **ESLint 9** - Flat config linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting
- **concurrently** - Run multiple processes
- **tsx** - TypeScript execution

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **PostgreSQL** - Containerized database

## 📝 Scripts

### Root Level

```bash
pnpm dev          # Start models (watch) + server + client with colored logs
pnpm build        # Build all packages
pnpm lint         # Lint all packages
pnpm format       # Format all packages
```

### Package Level

```bash
# Run command in specific package
pnpm -F @elsie/client <command>
pnpm -F @elsie/server <command>
pnpm -F @elsie/models <command>

# Run command in all packages
pnpm -r <command>
```

## 🔧 Configuration

### TypeScript

- **tsconfig.base.json** - Base configuration with path mappings for all packages
- Each package extends the base config with package-specific settings
- Path aliases: `@elsie/*` → `packages/*/src`

#### Build Configuration

Each package uses a dual tsconfig setup:

1. **tsconfig.json** - Development type-checking (extends `tsconfig.base.json`)
2. **tsconfig.build.json** - Production builds with output

**Key Build Settings:**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,         // Enable JavaScript output (critical!)
    "outDir": "dist",        // Output directory
    "declaration": true,     // Generate .d.ts type declarations
    "composite": true        // Enable project references
  },
  "references": []           // Dependencies on other packages
}
```

**Important:** `noEmit: false` is required in `tsconfig.build.json` to generate JavaScript files. The base config should not set `noEmit`, `composite`, or `declaration` to avoid conflicts.

#### Package References

Packages can reference each other for type-safe imports:

```
@elsie/server
  └─ references → @elsie/models

@elsie/client
  └─ imports types from → @elsie/server (via dist/index.d.ts)
```

This ensures:
- ✅ Type safety across package boundaries
- ✅ Incremental builds
- ✅ Proper build order (models → server → client)

### ESLint

- **eslint.config.mjs** - Flat config for ESLint 9
- Separate configs for React (client) and Node.js (server)
- Integrated with Prettier
- Type-aware linting with TypeScript

### Git Hooks

- **Pre-commit:** Runs ESLint + Prettier on staged files
- Configured via Husky + lint-staged

## 🏃 Development Workflow

1. **Start dev mode** - `pnpm dev` runs all packages in watch mode
2. **Make changes** in any package
3. **Auto-reload:**
   - Models: TypeScript rebuilds automatically (watch mode)
   - Server: tsx restarts on file changes (hot reload)
   - Client: Vite HMR updates instantly (no page refresh)
4. **Pre-commit hook** ensures code quality before commit
5. **Build** for production with `pnpm build`

### Type Safety Flow

```
┌─────────────────────────────────────────────────────┐
│ 1. Define schema in @elsie/models (Zod + TS types) │
└──────────────────┬──────────────────────────────────┘
                   │
       ┌───────────┴───────────┐
       ▼                       ▼
┌──────────────┐        ┌──────────────┐
│ 2. Server    │        │ 2. Client    │
│ imports      │        │ imports      │
│ schemas      │        │ types        │
└──────┬───────┘        └──────┬───────┘
       │                       │
       ▼                       │
┌──────────────┐               │
│ 3. Server    │               │
│ exports      │───────────────┤
│ AppRouter    │               │
└──────────────┘               ▼
                        ┌──────────────┐
                        │ 4. Client    │
                        │ imports      │
                        │ AppRouter    │
                        │ (type only)  │
                        └──────────────┘
                                │
                                ▼
                        ┌──────────────┐
                        │ 5. Full type │
                        │ safety on    │
                        │ tRPC calls   │
                        └──────────────┘
```

**Key Points:**
- Models must be built first (TypeScript watch mode handles this)
- Server must be built to generate `dist/index.d.ts` for client to import types
- Client uses `import type` to avoid bundling server code
- Changes to models automatically trigger server type updates

### Adding Dependencies

```bash
# Add to workspace root (shared tooling)
pnpm add -D -w <package>

# Add to specific package
pnpm add <package> --filter @elsie/client
pnpm add <package> --filter @elsie/server
pnpm add <package> --filter @elsie/models
```

### Creating New Packages

```bash
# Create package directory
mkdir packages/new-package
cd packages/new-package

# Initialize package.json
pnpm init

# Add to workspace (already done if in packages/*)
```

## 🔐 Environment Variables

Each package may require specific environment variables. See package READMEs for details:

- [Client environment setup](./packages/client/README.md)
- [Server environment setup](./packages/server/README.md)

## 🐳 Docker

The project includes Docker support for containerized development and deployment.

### Using Docker Compose

```bash
# Start all services (database, server, client)
docker-compose up

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up --build
```

### Docker Services

- **PostgreSQL** - Database container on port `5432`
- **Server** - Backend API container on port `3000`
- **Client** - Frontend container on port `3001`

### Development with Docker

```bash
# Start only the database
docker-compose up postgres -d

# Run server and client locally (with hot reload)
pnpm dev
```

This hybrid approach gives you:
- ✅ Consistent database environment
- ✅ Fast hot reload for code changes
- ✅ No need to install PostgreSQL locally

### Production Build

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Run production containers
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Testing (Future)

Recommended setup:
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

## 📚 Package Documentation

For detailed information about each package, see their individual READMEs:

- [Client Documentation](./packages/client/README.md)
- [Server Documentation](./packages/server/README.md)
- [Models Documentation](./packages/models/README.md)

## 📦 Updating Dependencies

### Check for Updates

```bash
# Check outdated packages across all workspaces
pnpm -r outdated

# Check only root dependencies
pnpm outdated

# Check specific package
pnpm -F @elsie/client outdated
```

### Update Packages (Recommended: Interactive Mode)

```bash
# Interactive update - choose which packages to update
pnpm -r update --interactive --latest

# Update specific package in all workspaces
pnpm -r update react --latest

# Update in specific workspace
pnpm -F @elsie/client update @tanstack/react-router --latest
```

### Update Workflow

```bash
# 1. Check what's outdated
pnpm -r outdated

# 2. Update interactively (safest - choose what to update)
pnpm -r update --interactive --latest

# 3. Test everything
pnpm -r build
pnpm -r lint
pnpm dev

# 4. Commit changes including lockfile
git add pnpm-lock.yaml package.json packages/*/package.json
git commit -m "chore: update dependencies"
```

### Update Categories

**All Packages**
```bash
# Update everything (review carefully)
pnpm -r update --latest
```

**Dev Dependencies Only**
```bash
pnpm -r update --dev --latest
```

**Specific Package Types**
```bash
# Update all @tanstack packages
pnpm -r update "@tanstack/*" --latest

# Update all @types packages
pnpm -r update "@types/*" --latest

# Update TypeScript
pnpm -r update typescript --latest
```

### Best Practices

1. ✅ **Use interactive mode** - Review each update before applying
2. ✅ **Update frequently** - Small updates are safer than big jumps
3. ✅ **Test after updates** - Run build, lint, and dev mode
4. ✅ **Commit lockfile** - Always include `pnpm-lock.yaml`
5. ✅ **Check changelogs** - Review breaking changes before updating

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure tests pass (when available)
4. Run `pnpm lint` and `pnpm format`
5. Commit (pre-commit hooks will run)
6. Push and create a pull request

## 📄 License

This project is private and proprietary.

## 🔗 Useful Links

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Vite Documentation](https://vite.dev)
- [Express Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
