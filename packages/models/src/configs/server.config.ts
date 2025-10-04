import z from 'zod'

const serverConfig = z.object({
  port: z.number(),
  corsOrigin: z.string(),

  dbUser: z.string(),
  dbPassword: z.string(),
  dbHost: z.string(),
  dbPort: z.number(),
  dbName: z.string(),

  jwtAccessTokenExpired: z.string(),
  jwtAccessTokenSecret: z.string(),
  jwtRefreshTokenExpired: z.string(),
  jwtRefreshTokenSecret: z.string(),

  nodeEnv: z.enum(['development', 'production']).default('development')
})

export type ServerConfig = z.infer<typeof serverConfig>

export const serverConfigSchema = serverConfig
