import { boolean, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { activeStatusEnum, roleEnum } from './_enums';
import { orgs, outlets } from './org';

// Passwords are argon2 hashes, shown once at set/reset — no reveal-anytime (CLAUDE.md "Auth").
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => orgs.id),
    role: roleEnum('role').notNull(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    pwdHash: text('pwd_hash').notNull(),
    mustChangePassword: boolean('must_change_password').notNull().default(true),
    status: activeStatusEnum('status').notNull().default('active'),
    lastActiveAt: timestamp('last_active_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('users_org_email_unique').on(table.orgId, table.email)],
);

// An auditor's outlet access (A3: "outlet access ... work from the expanded row").
export const auditorOutlets = pgTable(
  'auditor_outlets',
  {
    orgId: uuid('org_id')
      .notNull()
      .references(() => orgs.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    outletId: uuid('outlet_id')
      .notNull()
      .references(() => outlets.id),
  },
  (table) => [primaryKey({ columns: [table.userId, table.outletId] })],
);

// Signed-cookie sessions; admin-revocable via "end all sessions" (F4).
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  orgId: uuid('org_id')
    .notNull()
    .references(() => orgs.id),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
