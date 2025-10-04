import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './seeds',
  schema: './src/db/schema/*.schema.ts',
  dialect: 'postgresql'
})
