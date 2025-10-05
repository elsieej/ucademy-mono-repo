import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from '@/utils/jwt'
import { TokenPayloadSchema } from '@elsie/models'

export const tokenService = {
  signAccessToken: async (payload: TokenPayloadSchema) => {
    return signAccessToken(payload)
  },
  signRefreshToken: async (payload: TokenPayloadSchema) => {
    return signRefreshToken(payload)
  },
  verifyAccessToken: async (token: string) => {
    return verifyAccessToken(token)
  },
  verifyRefreshToken: async (token: string) => {
    return verifyRefreshToken(token)
  }
}
