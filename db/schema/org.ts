import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { activeStatusEnum } from './_enums';

// Single firm today, but org_id still goes on every table from migration 1
// per CLAUDE.md's coding convention, so multi-tenant never requires a backfill.
export const orgs = pgTable('orgs', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Brand -> outlet hierarchy (ARCHITECTURE §5, D13).
export const brands = pgTable('brands', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id')
    .notNull()
    .references(() => orgs.id),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const outlets = pgTable('outlets', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id')
    .notNull()
    .references(() => orgs.id),
  brandId: uuid('brand_id')
    .notNull()
    .references(() => brands.id),
  name: text('name').notNull(),
  city: text('city'),
  status: activeStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
