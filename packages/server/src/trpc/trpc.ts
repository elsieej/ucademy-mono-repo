import { initTRPC } from '@trpc/server'
import z, { ZodError } from 'zod'
import { Context } from './context'

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    const { shape, error } = opts
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          // Only show zod errors for bad request errors
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError ? z.treeifyError(error.cause) : null
      }
    }
  }
})

export const router = t.router
export const publicProcedure = t.procedure
