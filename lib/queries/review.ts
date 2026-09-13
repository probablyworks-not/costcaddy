import { and, asc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { auditOperationalFiles, audits, outlets, templates, users } from '@/db/schema';

export type ReviewQueueRow = {
  id: string;
  outletName: string;
  auditorName: string;
  dueDate: string;
  submittedAt: Date | null;
};

// C1 — reviewQueue: submitted audits awaiting review & publish. Published audits drop
// off the queue; there is no unsubmit, so 'submitted' is the only state that belongs here.
export async function listReviewQueue(orgId: string): Promise<ReviewQueueRow[]> {
  const rows = await db
    .select({
      id: audits.id,
      outletName: outlets.name,
      auditorName: users.name,
      dueDate: audits.dueDate,
      submittedAt: audits.submittedAt,
    })
    .from(audits)
    .innerJoin(outlets, eq(outlets.id, audits.outletId))
    .innerJoin(users, eq(users.id, audits.auditorId))
    .where(and(eq(audits.orgId, orgId), eq(audits.status, 'submitted')))
    .orderBy(asc(audits.submittedAt));

  return rows;
}

export type ReviewAuditDetail = {
  id: string;
  status: (typeof audits.status.enumValues)[number];
  dueDate: string;
  outletId: string;
  outletName: string;
  auditorName: string;
  templateName: string;
  reportGeneratedAt: Date | null;
  version: number;
  publishedAt: Date | null;
};

// Loads one audit scoped to the reviewing org — never trusts a bare id across orgs.
export async function getAuditForReview(orgId: string, auditId: string): Promise<ReviewAuditDetail | null> {
  const [row] = await db
    .select({
      id: audits.id,
      status: audits.status,
      dueDate: audits.dueDate,
      outletId: audits.outletId,
      outletName: outlets.name,
      auditorName: users.name,
      templateName: templates.name,
      reportGeneratedAt: audits.reportGeneratedAt,
      version: audits.version,
      publishedAt: audits.publishedAt,
    })
    .from(audits)
    .innerJoin(outlets, eq(outlets.id, audits.outletId))
    .innerJoin(users, eq(users.id, audits.auditorId))
    .innerJoin(templates, eq(templates.id, audits.templateId))
    .where(and(eq(audits.id, auditId), eq(audits.orgId, orgId)))
    .limit(1);

  return row ?? null;
}

export type OperationalFileRow = {
  id: string;
  type: (typeof auditOperationalFiles.type.enumValues)[number];
  period: string;
  name: string;
  format: string;
  storagePath: string;
  parseStatus: (typeof auditOperationalFiles.parseStatus.enumValues)[number];
  coverageSummary: string | null;
  uploadedAt: Date;
};

export async function listOperationalFiles(auditId: string): Promise<OperationalFileRow[]> {
  return db
    .select({
      id: auditOperationalFiles.id,
      type: auditOperationalFiles.type,
      period: auditOperationalFiles.period,
      name: auditOperationalFiles.name,
      format: auditOperationalFiles.format,
      storagePath: auditOperationalFiles.storagePath,
      parseStatus: auditOperationalFiles.parseStatus,
      coverageSummary: auditOperationalFiles.coverageSummary,
      uploadedAt: auditOperationalFiles.uploadedAt,
    })
    .from(auditOperationalFiles)
    .where(eq(auditOperationalFiles.auditId, auditId))
    .orderBy(asc(auditOperationalFiles.uploadedAt));
}

