import { users } from '@/db/schema/users.schema'
import { db } from '@/lib/db'
import { logger } from '@/lib/pino'
import { getDbErrorMessage } from '@/utils/errors'
import { hashPassword, verifyPassword } from '@/utils/hashing'
import { tryCatch } from '@/utils/try-catch'
import { RefreshTokenDto, UserId, UserLoginDto, UserRegisterDto, UserResponseSchema } from '@elsie/models'
import { TRPCError } from '@trpc/server'
import { tokenService } from './token.service'
import { userService } from './users.service'

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
    const userId = insertedUser[0].id as UserId
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
  },
  login: async (input: UserLoginDto) => {
    const { email, password } = input

    const [user, userError] = await tryCatch(userService.findByEmail(email))

    if (userError) {
      logger.error(userError, '[SERVER][AUTH] Failed to find user')
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to find user' })
    }

    if (!user) {
      logger.error('[SERVER][AUTH] User not found')
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }

    const [isPasswordValid, isPasswordValidError] = await tryCatch(verifyPassword(password, user.password))

    if (isPasswordValidError) {
      logger.error(isPasswordValidError, '[SERVER][AUTH] Failed to compare password')
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to compare password' })
    }

    if (!isPasswordValid) {
      logger.error('[SERVER][AUTH] Invalid password')
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid password' })
    }

    const [tokens, tokensError] = await tryCatch(
      Promise.all([
        tokenService.signAccessToken({ userId: user.id as UserId, email }),
        tokenService.signRefreshToken({ userId: user.id as UserId, email })
      ])
    )

    if (tokensError) {
      logger.error(tokensError, '[SERVER][AUTH] Failed to sign tokens')
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to sign tokens' })
    }

    return {
      accessToken: tokens[0],
      refreshToken: tokens[1],
      user: user as UserResponseSchema
    }
  },
  refresh: async (input: RefreshTokenDto) => {
    const { refreshToken } = input

    const [decoded, decodedError] = await tryCatch(tokenService.verifyRefreshToken(refreshToken))

    if (decodedError) {
      logger.error(decodedError, '[SERVER][AUTH] Failed to verify refresh token')
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to verify refresh token' })
    }

    if (!decoded) {
      logger.error('[SERVER][AUTH] Invalid refresh token')
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid refresh token' })
    }

    const [user, userError] = await tryCatch(userService.findById(decoded.userId))

    if (userError) {
      logger.error(userError, '[SERVER][AUTH] Failed to find user')
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to find user' })
    }

    if (!user) {
      logger.error('[SERVER][AUTH] User not found')
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    }

    const [tokens, tokensError] = await tryCatch(
      Promise.all([
        tokenService.signAccessToken({ userId: decoded.userId, email: decoded.email }),
        tokenService.signRefreshToken({ userId: decoded.userId, email: decoded.email })
      ])
    )

    if (tokensError) {
      logger.error(tokensError, '[SERVER][AUTH] Failed to sign tokens')
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to sign tokens' })
    }

    return {
      accessToken: tokens[0],
      refreshToken: tokens[1]
    }
  }
}
