import { pgEnum } from 'drizzle-orm/pg-core';
import { OPERATIONAL_FILE_TYPES } from '@/lib/operational/types';

// RBAC roles (F4). 'outlet' has no password — report-token access only — but the
// role still appears here so authorization checks have one vocabulary.
export const roleEnum = pgEnum('role', ['super_admin', 'auditor', 'outlet']);

export const activeStatusEnum = pgEnum('active_status', ['active', 'suspended']);

export const metricSectionEnum = pgEnum('metric_section', [
  'covers',
  'sales',
  'discount',
  'tax',
  'cost',
]);
export const metricRevGroupEnum = pgEnum('metric_rev_group', ['bar', 'kitchen']);
export const metricKindEnum = pgEnum('metric_kind', ['tax', 'charge']);
export const metricCostGroupEnum = pgEnum('metric_cost_group', ['bar', 'kitchen', 'nc']);
export const metricUnitEnum = pgEnum('metric_unit', ['currency', 'count', 'number', 'percent']);

export const auditStatusEnum = pgEnum('audit_status', [
  'assigned',
  'in-progress',
  'submitted',
  'published',
]);
export const polishStateEnum = pgEnum('polish_state', ['polishing', 'ready', 'failed']);

export const itemStatusEnum = pgEnum('item_status', [
  'pending',
  'pass',
  'fail',
  'observation',
  'na',
]);
export const severityEnum = pgEnum('severity', ['High', 'Medium', 'Low']);
export const resolutionStatusEnum = pgEnum('resolution_status', ['Pending', 'Resolved']);
export const fileKindEnum = pgEnum('file_kind', ['image', 'file']);

// Operational report types (C1) — the fixed vocabulary seen in Super Admin
// Flow.dc.html's OPREPORTS_SEED/OPPOOL (EXECUTION.md C1). Sourced from
// lib/operational/types so client components can share the same list without
// pulling the Postgres driver into the browser bundle.
export const operationalFileTypeEnum = pgEnum('operational_file_type', OPERATIONAL_FILE_TYPES);

// Whether the file could actually be machine-read on attach. Excel/CSV are parsed for
// real; PDF/image have no OCR adapter yet (EXECUTION.md "Not yet designed" — per-client
// operational-file import adapters), so they always land here as 'unreadable'.
export const opFileParseStatusEnum = pgEnum('op_file_parse_status', ['parsed', 'unreadable']);
