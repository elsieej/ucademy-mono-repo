import { userSchema } from '@/schema'
import z from 'zod'

export const createUserDto = userSchema.pick({
  name: true,
  email: true,
  password: true
})

export type CreateUserDto = z.infer<typeof createUserDto>
