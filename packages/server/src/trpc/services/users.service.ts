import { users } from '@/db/schema'
import { db } from '@/lib/db'
import { logger } from '@/lib/pino'
import { tryCatch } from '@/utils/try-catch'
import { UserId } from '@elsie/models'
import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'

export const userService = {
  findById: async (id: UserId) => {
    const [user, userError] = await tryCatch(db.query.users.findFirst({ where: eq(users.id, id) }))

    if (userError) {
      logger.error(userError, '[SERVER][USERS] Failed to find user')
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to find user' })
    }

    if (!user) {
      logger.error('[SERVER][USERS] User not found')
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }

    return user
  },
  findByEmail: async (email: string) => {
    const [user, userError] = await tryCatch(db.query.users.findFirst({ where: eq(users.email, email) }))

    if (userError) {
      logger.error(userError, '[SERVER][USERS] Failed to find user')
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to find user' })
    }

    if (!user) {
      logger.error('[SERVER][USERS] User not found')
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }

    return user
  }
}
