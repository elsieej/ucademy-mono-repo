# @elsie/client

Modern React frontend application for the Elsie platform.

## 🚀 Features

- **React 19** - Latest React with improved performance
- **TypeScript** - Type-safe development
- **Vite 7** - Lightning-fast build tool and dev server
- **Hot Module Replacement** - Instant updates without page refresh
- **Shared Types** - Type safety with `@elsie/models`
- **ESLint & Prettier** - Code quality and formatting

## 🏗️ Project Structure

```
src/
├── assets/          # Static assets (images, icons)
├── App.tsx          # Main application component
├── App.css          # Application styles
├── main.tsx         # Application entry point
└── index.css        # Global styles
```

## 🔧 Getting Started

### Prerequisites

- Node.js 22.20.0 (managed via Volta)
- pnpm package manager

### Development

```bash
# Start development server (from package root)
pnpm dev

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

### Dev Dependencies

- **vite** - Build tool and dev server
- **@vitejs/plugin-react** - React plugin for Vite
- **@types/react** - TypeScript types for React
- **@types/react-dom** - TypeScript types for React DOM
- **globals** - Global type definitions

## 🔗 Integration with Backend

The client connects to the backend API at **http://localhost:3000**.

### Using Shared Types

Import types and schemas from `@elsie/models` for type safety:

```typescript
import { type Course } from '@elsie/models'

function CourseCard({ course }: { course: Course }) {
  return (
    <div>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
    </div>
  )
}
```

### Type Safety Across the Stack

During development:

1. Update types in `@elsie/models`
2. TypeScript watch automatically rebuilds
3. Both client and server get updated types
4. TypeScript errors show immediately in your IDE

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

## 🎨 Styling

The project uses vanilla CSS. You can easily integrate:

- **Tailwind CSS** - Utility-first CSS framework
- **CSS Modules** - Scoped CSS
- **Styled Components** - CSS-in-JS
- **Emotion** - CSS-in-JS with great TypeScript support

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
