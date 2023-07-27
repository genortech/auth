import { bigint, boolean, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('auth_user', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  emailVerified: boolean('email_verified'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const userKey = pgTable('user_key', {
  id: text('id').primaryKey(),
  userId: text("user_id").references(() => usersTable.id),
  hashedPassword: varchar('hashed_password', { length: 255 }),

})

export const userSessionTable = pgTable('user_session', {
  id: text('id').primaryKey(),
  userId: text("user_id").references(() => usersTable.id),
  activeExpires: bigint('active_expires', {
    mode: 'number'
  }).notNull(),
  idleExpires: bigint('idle_expires', {
    mode: 'number'
  }).notNull()

})

export const userEmailVerificationTable = pgTable('email_verification_token', {
  id: text('id').primaryKey(),
  userId: text("user_id").references(() => usersTable.id),
  expires: bigint('idle_expires', {
    mode: 'number'
  }).notNull(),

})

export const userPasswordVerificationTable = pgTable('password_reset_token', {
  id: text('id').primaryKey(),
  userId: text("user_id").references(() => usersTable.id),
  expires: bigint('idle_expires', {
    mode: 'number'
  }).notNull(),

})
