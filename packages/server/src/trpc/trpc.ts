import { initTRPC, TRPCError } from '@trpc/server'
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

// Create protected procedure
const authMiddleware = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated'
    })
  }

  return next({
    ctx: {
      ...ctx,
      // Ready to be used in procedures
      user: ctx.user
    }
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(authMiddleware)
