import { clientConfigSchema } from '@elsie/models'

const clientConfig = clientConfigSchema.safeParse(import.meta.env)

if (!clientConfig.success) {
  throw new Error(`Invalid environment variables`)
}

export const config = clientConfig.data
