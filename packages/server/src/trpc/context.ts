import { CreateExpressContextOptions } from '@trpc/server/adapters/express'

// Context available to all procedures
export type Context = Awaited<ReturnType<typeof createContext>>

// Create context for each request
export const createContext = async (opts: CreateExpressContextOptions) => {
  return {
    req: opts.req,
    res: opts.res
  }
}
