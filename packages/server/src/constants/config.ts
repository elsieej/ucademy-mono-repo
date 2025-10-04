import { serverConfigSchema } from '@elsie/models'
import dotenv from 'dotenv'
dotenv.config()

const serverConfig = serverConfigSchema.safeParse(process.env)

if (!serverConfig.success) {
  throw new Error('Invalid environment variables')
}

export const config = serverConfig.data
