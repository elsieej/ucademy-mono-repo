import { serverConfigSchema } from '@elsie/models'
import dotenv from 'dotenv'
import z from 'zod'
dotenv.config()

const serverConfig = serverConfigSchema.safeParse(process.env)

if (!serverConfig.success) {
  const error = z.treeifyError(serverConfig.error)
  throw new Error(
    `
    Invalid environment variables:
    --------------------------------
    ${JSON.stringify(error.properties, null, 2)}
    --------------------------------
    `
  )
}

export const config = serverConfig.data
