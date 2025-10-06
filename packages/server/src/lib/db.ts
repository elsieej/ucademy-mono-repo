import * as schema from '@/db/schema'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { config } from '../constants/config'

const pool = new Pool({
  user: config.dbUser,
  password: config.dbPassword,
  host: config.dbHost,
  port: config.dbPort,
  database: config.dbName
})

export const db = drizzle({ client: pool, schema })
