import {
  boolean,
  date,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import {
  auditStatusEnum,
  fileKindEnum,
  itemStatusEnum,
  metricCostGroupEnum,
  metricKindEnum,
  metricRevGroupEnum,
  metricSectionEnum,
  metricUnitEnum,
  polishStateEnum,
  resolutionStatusEnum,
  severityEnum,
} from './_enums';
import { orgs, outlets } from './org';
import { templates } from './templates';
import { users } from './users';

export const audits = pgTable('audits', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id')
    .notNull()
    .references(() => orgs.id),
  token: text('token').notNull().unique(),
  outletId: uuid('outlet_id')
    .notNull()
    .references(() => outlets.id),
  auditorId: uuid('auditor_id')
    .notNull()
    .references(() => users.id),
  templateId: uuid('template_id')
    .notNull()
    .references(() => templates.id),
  name: text('name'),
  dueStart: date('due_start'),
  dueDate: date('due_date').notNull(),
  status: auditStatusEnum('status').notNull().default('assigned'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  version: integer('version').notNull().default(0),
  polishState: polishStateEnum('polish_state'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// FROZEN copy of templateMetrics, taken at assign (A5) — later template edits never
// touch it. Invariant: "Template snapshot on assign".
export const auditMetricDefs = pgTable(
  'audit_metric_defs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => orgs.id),
    auditId: uuid('audit_id')
      .notNull()
      .references(() => audits.id),
    metricKey: text('metric_key').notNull(),
    label: text('label').notNull(),
    section: metricSectionEnum('section').notNull(),
    revGroup: metricRevGroupEnum('rev_group'),
    kind: metricKindEnum('kind'),
    costGroup: metricCostGroupEnum('cost_group'),
    den: text('den'),
    unit: metricUnitEnum('unit'),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (table) => [uniqueIndex('audit_metric_defs_audit_key_unique').on(table.auditId, table.metricKey)],
);

// Calculated figures are never typed (invariant) — only the raw entered metrics are
// stored here; computeMetrics (F7) derives totals at read time.
export const auditMetricValues = pgTable(
  'audit_metric_values',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => orgs.id),
    auditId: uuid('audit_id')
      .notNull()
      .references(() => audits.id),
    metricKey: text('metric_key').notNull(),
    value: numeric('value'),
  },
  (table) => [uniqueIndex('audit_metric_values_audit_key_unique').on(table.auditId, table.metricKey)],
);

// AuditItem (ARCHITECTURE §5). code/cat/catCode/label/guidance/freeform are copied
// from the template snapshot at assign time, same as auditMetricDefs.
export const auditItems = pgTable(
  'audit_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orgId: uuid('org_id')
      .notNull()
      .references(() => orgs.id),
    auditId: uuid('audit_id')
      .notNull()
      .references(() => audits.id),
    code: text('code').notNull(),
    cat: text('cat').notNull(),
    catCode: text('cat_code').notNull(),
    label: text('label').notNull(),
    guidance: text('guidance'),
    freeform: boolean('freeform').notNull().default(false),
    status: itemStatusEnum('status').notNull().default('pending'),
    remark: text('remark').notNull().default(''),
    naReason: text('na_reason'),
    // Set by the reviewer only, never in the field (fail/observation only).
    severity: severityEnum('severity'),
    impact: text('impact'),
    correctiveAction: text('corrective_action'),
    sla: text('sla'),
    ownership: text('ownership'),
    resolutionStatus: resolutionStatusEnum('resolution_status'),
    // Set by report generation (C3).
    refId: text('ref_id'),
    category: text('category'),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (table) => [uniqueIndex('audit_items_audit_code_unique').on(table.auditId, table.code)],
);

export const auditItemFiles = pgTable('audit_item_files', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id')
    .notNull()
    .references(() => orgs.id),
  auditItemId: uuid('audit_item_id')
    .notNull()
    .references(() => auditItems.id),
  kind: fileKindEnum('kind').notNull(),
  name: text('name').notNull(),
  // Supabase Storage path behind a signed URL (F5) — never a public URL.
  storagePath: text('storage_path').notNull(),
  meta: text('meta'),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull().defaultNow(),
});
