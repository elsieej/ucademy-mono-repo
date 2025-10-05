import { users } from '@/db/schema/users.schema'
import { db } from '@/lib/db'
import { logger } from '@/lib/pino'
import { hashPassword } from '@/utils/hashing'
import { tryCatch } from '@/utils/try-catch'
import { UserRegisterDto } from '@elsie/models'
import { TRPCError } from '@trpc/server'
import { tokenService } from './token.service'
import { getDbErrorMessage } from '@/utils/errors'

export const authService = {
  register: async (input: UserRegisterDto) => {
    const { name, email, password } = input

    // Hash password
    const [hashedPassword, hashError] = await tryCatch(hashPassword(password))
    if (hashError) {
      logger.error(hashError, '[SERVER][AUTH] Failed to hash password')
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to hash password' })
    }

    // Insert user (now hashedPassword is guaranteed to be non-null)
    const [insertedUser, insertError] = await tryCatch(
      db.insert(users).values({ name, email, password: hashedPassword }).returning()
    )

    if (insertError) {
      const { message, constraint } = getDbErrorMessage(insertError)
      logger.error({ message, constraint }, '[SERVER][AUTH] Failed to register user')
      throw new TRPCError({ code: 'CONFLICT', message, cause: constraint })
    }

    // Sign tokens
    const userId = insertedUser[0].id
    const [tokens, tokensError] = await tryCatch(
      Promise.all([tokenService.signAccessToken({ userId, email }), tokenService.signRefreshToken({ userId, email })])
    )

    if (tokensError) {
      logger.error(tokensError, '[SERVER][AUTH] Failed to sign tokens')
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to sign tokens' })
    }

    return {
      accessToken: tokens[0],
      refreshToken: tokens[1],
      user: insertedUser[0]
    }
  }
}
