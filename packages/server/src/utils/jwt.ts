import jwt from 'jsonwebtoken'
import { config } from '@/constants/config'
import ms, { StringValue } from 'ms'
import { TokenPayloadSchema } from '@elsie/models'

export const signAccessToken = (payload: TokenPayloadSchema) => {
  return jwt.sign(payload, config.jwtAccessTokenSecret, {
    expiresIn: ms(config.jwtAccessTokenExpired as StringValue),
    algorithm: 'HS256'
  })
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.jwtAccessTokenSecret, {
    algorithms: ['HS256']
  })
}

export const signRefreshToken = (payload: TokenPayloadSchema) => {
  return jwt.sign(payload, config.jwtRefreshTokenSecret, {
    expiresIn: ms(config.jwtRefreshTokenExpired as StringValue),
    algorithm: 'HS256'
  })
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.jwtRefreshTokenSecret, {
    algorithms: ['HS256']
  })
}
