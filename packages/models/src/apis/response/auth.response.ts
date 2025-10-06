import { userSchema } from '@/schema'
import z from 'zod'

export const tokenPayloadSchema = z.object({
  userId: z.uuid(),
  email: z.email()
})

export type TokenPayloadSchema = z.infer<typeof tokenPayloadSchema>

export const userRegisterResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: userSchema.omit({ password: true })
})

export type UserRegisterResponseSchema = z.infer<typeof userRegisterResponseSchema>

export const userResponseSchema = userSchema.omit({ password: true })

export type UserResponseSchema = z.infer<typeof userResponseSchema>
