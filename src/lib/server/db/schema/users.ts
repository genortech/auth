import { bigint, integer, pgTable, serial, text } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('auth_user', {
  id: serial('id').notNull().primaryKey(),
  email: text('email').notNull()
})

export const userKey = pgTable('user_key', {
  id: serial('id').notNull().primaryKey(),
  userId: integer('user_id').notNull().references(() => usersTable.id),
  hashedPassword: text('password')
})

export const userSession = pgTable('user_session', {
  id: serial('id').notNull().primaryKey(),
  userId: integer('user_id').notNull().references(() => usersTable.id),
  activeExpires: bigint('active_expires', {
    mode: 'number'
  }).notNull(),
  idleExpires: bigint('idle_expires', {
    mode: 'number'
  }).notNull()

})
