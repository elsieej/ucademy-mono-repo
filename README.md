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
React 19 frontend application built with Vite 7.

- **Port:** `http://localhost:3001`
- **Tech:** React, TypeScript, Vite
- **Features:** Hot Module Replacement, Fast Refresh

### [@elsie/server](./packages/server)
Express 5 backend API with PostgreSQL database.

- **Port:** `http://localhost:3000`
- **Tech:** Express, PostgreSQL, Drizzle ORM, JWT
- **Features:** Type-safe database queries, JWT authentication

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

### Backend
- **Express 5** - Web framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Type-safe database queries
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

- **tsconfig.base.json** - Base configuration with path mappings
- Each package extends the base config with specific settings
- Path aliases: `@elsie/*` → `packages/*/src`

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
   - Models: TypeScript rebuilds automatically
   - Server: tsx restarts on file changes
   - Client: Vite HMR updates instantly
4. **Pre-commit hook** ensures code quality before commit
5. **Build** for production with `pnpm build`

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
