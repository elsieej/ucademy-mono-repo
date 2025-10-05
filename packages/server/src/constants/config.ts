import { serverConfigSchema } from '@elsie/models'
import dotenv from 'dotenv'
import { logger } from '../lib/pino'
import z from 'zod'
dotenv.config()

const serverConfig = serverConfigSchema.safeParse(process.env)

if (!serverConfig.success) {
  const error = z.treeifyError(serverConfig.error)
  logger.error(`${JSON.stringify(error.properties, null, 2)}`)
  throw new Error(`Invalid environment variables`)
}

export const config = serverConfig.data
