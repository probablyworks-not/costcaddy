'use server';

import { randomBytes } from 'node:crypto';
import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { audits, reports } from '@/db/schema';
import { requireRole } from '@/lib/auth';
import { reportFilePath, uploadFile } from '@/lib/storage';
import { loadReportViewModel } from '@/lib/report/reportViewModel';
import { renderReportPdf } from '@/lib/report/renderReportPdf';
import { formatReportDate } from '@/lib/report/reportFormat';

function generateToken(): string {
  return randomBytes(9).toString('base64url');
}

// C5 — publish. Deliberately a SEPARATE action from any future "copy a share link"
// (R5: the mock's doPublish/shareLink mutated identically — settled as never conflating
// the two). Stamps a version + date, freezes the audit (requireReviewableAudit-style
// checks elsewhere only allow 'submitted', so a published audit can no longer be
// corrected), and renders the version-stamped PDF via Playwright — the only export
// format shipped (R12). Earlier versions' report rows are never touched or deleted, so
// with no audit trail, versioning is the only history.
export async function publishAudit(auditId: string): Promise<void> {
  const admin = await requireRole('super_admin');

  const [audit] = await db
    .select({ id: audits.id, orgId: audits.orgId, status: audits.status, version: audits.version, reportGeneratedAt: audits.reportGeneratedAt })
    .from(audits)
    .where(and(eq(audits.id, auditId), eq(audits.orgId, admin.orgId)))
    .limit(1);
  if (!audit) throw new Error('Not found');
  if (audit.status !== 'submitted') throw new Error('This audit is not open for publishing.');
  if (!audit.reportGeneratedAt) throw new Error('Generate the report before publishing.');

  const vm = await loadReportViewModel(admin.orgId, auditId);
  if (!vm) throw new Error('Not found');

  const version = audit.version + 1;
  const publishedAt = new Date();
  const pdf = await renderReportPdf(vm, { version, publishedAt: formatReportDate(publishedAt) });

  const pdfPath = reportFilePath(admin.orgId, auditId, version, 'report.pdf');
  await uploadFile(pdfPath, pdf, 'application/pdf');

  await db.transaction(async (tx) => {
    await tx.insert(reports).values({
      orgId: admin.orgId,
      auditId,
      version,
      token: generateToken(),
      publishedAt,
      pdfPath,
    });
    await tx.update(audits).set({ status: 'published', publishedAt, version }).where(eq(audits.id, auditId));
  });

  revalidatePath('/admin/review');
  revalidatePath(`/admin/review/${auditId}`);
  revalidatePath(`/admin/review/${auditId}/report`);
  redirect(`/admin/review/${auditId}/report`);
}
