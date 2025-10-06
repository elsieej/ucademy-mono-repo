import { userSchema } from '@/schema'
import z from 'zod'

export const userRegisterDto = userSchema.pick({
  name: true,
  email: true,
  password: true
})

export type UserRegisterDto = z.infer<typeof userRegisterDto>

export const userRegisterConfirmPasswordDto = userRegisterDto
  .extend({
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

export type UserRegisterConfirmPasswordDto = z.infer<typeof userRegisterConfirmPasswordDto>

export const userLoginDto = userSchema.pick({
  email: true,
  password: true
})

export type UserLoginDto = z.infer<typeof userLoginDto>
