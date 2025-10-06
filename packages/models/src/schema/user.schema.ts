import { zIdBrand } from '@/utils/id-brand'
import z from 'zod'

const user = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  password: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable()
})
const userId = zIdBrand('UserId')

export type UserId = z.infer<typeof userId>
export type UserModel = z.infer<typeof user>

export const userSchema = user
export const userIdSchema = userId
