import { integer, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { orgs } from './org';
import { audits } from './audits';

// Report (ARCHITECTURE §5). One row per PUBLISHED version — publish is a separate
// action from sharing (R5) and only publish stamps a new version; earlier versions
// remain, since with no audit trail versioning is the only history (C5). PDF via
// Playwright is the only export format shipped — no XLSX for now (EXECUTION.md R12).
export const reports = pgTable(
  'reports',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => orgs.id),
    auditId: uuid('audit_id')
      .notNull()
      .references(() => audits.id),
    version: integer('version').notNull(),
    token: text('token').notNull().unique(),
    publishedAt: timestamp('published_at', { withTimezone: true }).notNull().defaultNow(),
    pdfPath: text('pdf_path'),
    note: text('note'),
  },
  (table) => [uniqueIndex('reports_audit_version_unique').on(table.auditId, table.version)],
);
