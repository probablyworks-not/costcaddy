'use server';

import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { templateChecklistPoints, templateDepartments, templateMetrics, templates } from '@/db/schema';
import { requireRole } from '@/lib/auth';
import { builderCatCode, checklistPointCode } from '@/lib/templates/builderCode';
import type { TemplateDepartmentInput, TemplateMetricInput } from '@/lib/queries/templates';

export type SaveTemplateInput = {
  id: string | null;
  name: string;
  metrics: TemplateMetricInput[];
  departments: TemplateDepartmentInput[];
};

// A4: "Save Template" replaces the whole metric/department/checklist-point set in one
// transaction — the builder always submits full state, not a diff (mirrors the mock's
// saveTemplate). Reference codes are recomputed here, not trusted from the client.
export async function saveTemplate(input: SaveTemplateInput): Promise<void> {
  const admin = await requireRole('super_admin');
  const name = input.name.trim() || 'Untitled Checklist';
  const cleanMetrics = input.metrics.filter((m) => m.label.trim());
  const cleanDepartments = input.departments
    .map((d) => ({ ...d, code: d.code || builderCatCode(d.cat) }))
    .filter((d) => d.cat.trim());

  await db.transaction(async (tx) => {
    let tid = input.id;
    if (tid) {
      await tx.update(templates).set({ name }).where(eq(templates.id, tid));
      await tx.delete(templateMetrics).where(eq(templateMetrics.templateId, tid));
      await tx.delete(templateChecklistPoints).where(eq(templateChecklistPoints.templateId, tid));
      await tx.delete(templateDepartments).where(eq(templateDepartments.templateId, tid));
    } else {
      const [created] = await tx.insert(templates).values({ orgId: admin.orgId, name }).returning({ id: templates.id });
      tid = created.id;
    }

    if (cleanMetrics.length > 0) {
      await tx.insert(templateMetrics).values(
        cleanMetrics.map((m, i) => ({
          orgId: admin.orgId,
          templateId: tid!,
          metricKey: m.metricKey,
          label: m.label,
          section: m.section,
          revGroup: m.revGroup ?? null,
          kind: m.kind ?? null,
          costGroup: m.costGroup ?? null,
          den: m.den ?? null,
          unit: m.unit ?? null,
          sortOrder: i,
        })),
      );
    }

    for (let di = 0; di < cleanDepartments.length; di++) {
      const dept = cleanDepartments[di];
      const [createdDept] = await tx
        .insert(templateDepartments)
        .values({ orgId: admin.orgId, templateId: tid!, cat: dept.cat, code: dept.code, sortOrder: di })
        .returning({ id: templateDepartments.id });

      const points = dept.points.filter((p) => p.label.trim());
      if (points.length > 0) {
        await tx.insert(templateChecklistPoints).values(
          points.map((p, pi) => ({
            orgId: admin.orgId,
            templateId: tid!,
            departmentId: createdDept.id,
            label: p.label,
            guidance: p.guidance || null,
            freeform: !!p.freeform,
            code: checklistPointCode(dept.code, pi),
            sortOrder: pi,
          })),
        );
      }
    }

    return tid!;
  });

  revalidatePath('/admin/templates');
  redirect('/admin/templates');
}
