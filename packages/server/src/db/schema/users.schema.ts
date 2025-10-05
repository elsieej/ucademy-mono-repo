import { pgTable, varchar } from 'drizzle-orm/pg-core'
import { uuid } from 'drizzle-orm/pg-core'
import { timestamps } from '../colums.helper'
import { relations } from 'drizzle-orm'
import { refreshTokens } from './refresh-tokens.schema'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  ...timestamps
})

export const userRelations = relations(users, ({ many }) => ({
  refreshTokens: many(refreshTokens)
}))
