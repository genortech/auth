import { bigint, pgTable, text, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('auth_user', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
})

export const userKey = pgTable('user_key', {
  id: text('id').primaryKey(),
  userId: text("user_id").references(() => usersTable.id),
  hashedPassword: varchar('hashed_password', { length: 255 }),

})

export const userSession = pgTable('user_session', {
  id: text('id').primaryKey(),
  userId: text("user_id").references(() => usersTable.id),
  activeExpires: bigint('active_expires', {
    mode: 'number'
  }).notNull(),
  idleExpires: bigint('idle_expires', {
    mode: 'number'
  }).notNull()

})
