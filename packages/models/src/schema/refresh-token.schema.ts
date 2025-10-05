import z from 'zod'

const refreshToken = z.object({
  token: z.string(),
  userId: z.string(),
  expiresAt: z.string(),
  createdAt: z.string()
})

export type RefreshTokenModel = z.infer<typeof refreshToken>

export const refreshTokenSchema = refreshToken
