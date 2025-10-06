import { verifyAccessToken } from '@/utils/jwt'
import { userCache } from '@/utils/user-cache'
import { UserResponseSchema, UserId } from '@elsie/models'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { userService } from './services/users.service'
import { tryCatch } from '@/utils/try-catch'
import { logger } from '@/lib/pino'

// Context available to all procedures
export type Context = Awaited<ReturnType<typeof createContext>>

// Create context for each request
export const createContext = async (opts: CreateExpressContextOptions) => {
  const context = {
    req: opts.req,
    res: opts.res,
    user: null as UserResponseSchema | null
  }

  const authHeader = opts.req.headers.authorization

  // If no authorization header, return
  if (!authHeader) {
    return context
  }

  // Get token from authorization header
  const token = authHeader.split(' ')[1]

  // If no token, return
  if (!token) {
    return context
  }

  // Verify token
  const decoded = verifyAccessToken(token)

  // If token is invalid, return
  if (!decoded) {
    return context
  }

  // Try to get user from cache first
  const cachedUser = userCache.get(decoded.userId)

  if (cachedUser) {
    context.user = cachedUser
    return context
  }

  // Cache miss - fetch from database
  const [fetchedUser, userError] = await tryCatch(userService.findById(decoded.userId))

  if (userError) {
    logger.error(userError, '[SERVER][CONTEXT] Failed to find user')
    return context
  }

  if (!fetchedUser) {
    logger.error('[SERVER][CONTEXT] User not found')
    return context
  }

  // Cache the user
  userCache.set(decoded.userId as UserId, fetchedUser)
  context.user = fetchedUser

  return context
}
