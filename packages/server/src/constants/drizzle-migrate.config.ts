import { defineConfig } from 'drizzle-kit'
import { config } from './config'

export default defineConfig({
  out: './migrations',
  schema: './src/db/schema/*.schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: `postgresql://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}`
  }
})
