import { pgEnum } from 'drizzle-orm/pg-core';

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
export const metricUnitEnum = pgEnum('metric_unit', ['currency', 'count']);

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
