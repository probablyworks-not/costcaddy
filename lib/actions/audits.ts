'use server';

import { randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import {
  auditItems,
  auditMetricDefs,
  audits,
  templateChecklistPoints,
  templateDepartments,
  templateMetrics,
} from '@/db/schema';
import { requireRole } from '@/lib/auth';

export type CreateAuditState = { error?: string; created?: boolean };

function generateToken(): string {
  return randomBytes(6).toString('base64url');
}

// A5: picking a template and an auditor creates the audit; it holds its OWN COPY of the
// template (metricDefs cloned, items materialised) so later template edits never touch
// it — the "template snapshot on assign" invariant, done in one transaction.
export async function createAudit(
  _prev: CreateAuditState,
  formData: FormData,
): Promise<CreateAuditState> {
  const admin = await requireRole('super_admin');
  const outletId = String(formData.get('outletId') ?? '');
  const templateId = String(formData.get('templateId') ?? '');
  const auditorId = String(formData.get('auditorId') ?? '');
  const name = String(formData.get('name') ?? '').trim() || null;
  const dueStart = String(formData.get('dueStart') ?? '') || null;
  const dueEnd = String(formData.get('dueEnd') ?? '') || null;

  if (!outletId || !templateId || !auditorId) {
    return { error: 'Pick a template and an auditor' };
  }
  if (!dueEnd && !dueStart) {
    return { error: 'Set a due date' };
  }

  await db.transaction(async (tx) => {
    const [audit] = await tx
      .insert(audits)
      .values({
        orgId: admin.orgId,
        token: generateToken(),
        outletId,
        auditorId,
        templateId,
        name,
        dueStart,
        dueDate: dueEnd ?? dueStart!,
        status: 'assigned',
      })
      .returning({ id: audits.id });

    const metrics = await tx.select().from(templateMetrics).where(eq(templateMetrics.templateId, templateId));
    if (metrics.length > 0) {
      await tx.insert(auditMetricDefs).values(
        metrics.map((m) => ({
          orgId: admin.orgId,
          auditId: audit.id,
          metricKey: m.metricKey,
          label: m.label,
          section: m.section,
          revGroup: m.revGroup,
          kind: m.kind,
          costGroup: m.costGroup,
          den: m.den,
          unit: m.unit,
          sortOrder: m.sortOrder,
        })),
      );
    }

    const departments = await tx
      .select()
      .from(templateDepartments)
      .where(eq(templateDepartments.templateId, templateId));
    const points = await tx
      .select()
      .from(templateChecklistPoints)
      .where(eq(templateChecklistPoints.templateId, templateId));

    let sortOrder = 0;
    for (const dept of departments) {
      const deptPoints = points.filter((p) => p.departmentId === dept.id);
      if (deptPoints.length === 0) continue;
      await tx.insert(auditItems).values(
        deptPoints.map((p) => ({
          orgId: admin.orgId,
          auditId: audit.id,
          code: p.code,
          cat: dept.cat,
          catCode: dept.code,
          label: p.label,
          guidance: p.guidance,
          freeform: p.freeform,
          sortOrder: sortOrder++,
        })),
      );
    }
  });

  revalidatePath(`/admin/restaurants/${outletId}`);
  return { created: true };
}
