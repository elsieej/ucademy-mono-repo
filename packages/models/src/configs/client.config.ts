import z from 'zod'

const clientConfig = z.object({
  VITE_API_URL: z.string(),

  MODE: z.enum(['development', 'production']).default('development')
})

export type ClientConfig = z.infer<typeof clientConfig>

export const clientConfigSchema = clientConfig
