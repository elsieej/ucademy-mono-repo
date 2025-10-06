import { config } from '@/constants/config'
import { logger } from '@/lib/pino'
import { TokenPayloadSchema } from '@elsie/models'
import jwt from 'jsonwebtoken'
import ms, { StringValue } from 'ms'

export const signAccessToken = (payload: TokenPayloadSchema) => {
  return jwt.sign(payload, config.jwtAccessTokenSecret, {
    expiresIn: ms(config.jwtAccessTokenExpired as StringValue),
    algorithm: 'HS256'
  })
}

export const verifyAccessToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, config.jwtAccessTokenSecret, {
      algorithms: ['HS256']
    }) as TokenPayloadSchema
    return decoded
  } catch (error) {
    logger.error(error, '[SERVER][JWT] Failed to verify access token')
    return null
  }
}

export const signRefreshToken = (payload: TokenPayloadSchema) => {
  return jwt.sign(payload, config.jwtRefreshTokenSecret, {
    expiresIn: ms(config.jwtRefreshTokenExpired as StringValue),
    algorithm: 'HS256'
  })
}

export const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, config.jwtRefreshTokenSecret, {
      algorithms: ['HS256']
    }) as TokenPayloadSchema
    return decoded
  } catch (error) {
    logger.error(error, '[SERVER][JWT] Failed to verify refresh token')
    return null
  }
}
