import { pgTable, varchar } from 'drizzle-orm/pg-core'
import { uuid } from 'drizzle-orm/pg-core'
import { timestamps } from '../colums.helper'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  ...timestamps
})
