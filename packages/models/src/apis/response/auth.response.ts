import { userIdSchema, userSchema } from '@/schema'
import z from 'zod'

export const tokenPayloadSchema = z.object({
  email: z.email(),
  userId: userIdSchema
})

export type TokenPayloadSchema = z.infer<typeof tokenPayloadSchema>

export const tokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
})

export type TokenResponseSchema = z.infer<typeof tokenResponseSchema>

export const userRegisterResponseSchema = tokenResponseSchema.pick({ accessToken: true, refreshToken: true }).extend({
  user: userSchema.omit({ password: true })
})

export type UserRegisterResponseSchema = z.infer<typeof userRegisterResponseSchema>

export const userLoginResponseSchema = userRegisterResponseSchema

export type UserLoginResponseSchema = z.infer<typeof userLoginResponseSchema>

export const userResponseSchema = userSchema.omit({ password: true })

export type UserResponseSchema = z.infer<typeof userResponseSchema>
