import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import z, { ZodError } from 'zod'
import { Context } from './context'
// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts
    return {
      ...shape,
      message: error.message,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? z.treeifyError(error.cause) : null
      }
    }
  }
})

export const router = t.router
export const publicProcedure = t.procedure
