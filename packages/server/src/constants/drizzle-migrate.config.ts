import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './migrations',
  schema: './src/db/schema/*.schema.ts',
  dialect: 'postgresql'
})
