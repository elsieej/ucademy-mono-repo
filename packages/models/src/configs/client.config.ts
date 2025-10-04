import z from 'zod'

const clientConfig = z.object({
  apiUrl: z.string(),

  nodeEnv: z.enum(['development', 'production']).default('development')
})

export type ClientConfig = z.infer<typeof clientConfig>

export const clientConfigSchema = clientConfig
