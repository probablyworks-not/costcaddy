import { asc, eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import {
  templateChecklistPoints,
  templateDepartments,
  templateMetrics,
  templates,
} from '@/db/schema';

export type TemplateRow = {
  id: string;
  name: string;
  metricCount: number;
  departmentCount: number;
  checkpointCount: number;
};

export async function listTemplates(orgId: string): Promise<TemplateRow[]> {
  const rows = await db
    .select({
      id: templates.id,
      name: templates.name,
      // templates.id must be qualified — each correlated subquery's own table has its own
      // unqualified "id" column, so an unqualified `${templates.id}` resolves to that inner
      // "id" instead of the outer one, silently matching nothing (see BUG-014).
      metricCount: sql<number>`(select count(*) from ${templateMetrics} where ${templateMetrics.templateId} = ${sql.raw('"templates"."id"')})`,
      departmentCount: sql<number>`(select count(*) from ${templateDepartments} where ${templateDepartments.templateId} = ${sql.raw('"templates"."id"')})`,
      checkpointCount: sql<number>`(select count(*) from ${templateChecklistPoints} where ${templateChecklistPoints.templateId} = ${sql.raw('"templates"."id"')})`,
    })
    .from(templates)
    .where(eq(templates.orgId, orgId))
    .orderBy(templates.createdAt);

  return rows.map((r) => ({
    ...r,
    metricCount: Number(r.metricCount),
    departmentCount: Number(r.departmentCount),
    checkpointCount: Number(r.checkpointCount),
  }));
}

export type TemplateMetricInput = {
  metricKey: string;
  label: string;
  section: 'covers' | 'sales' | 'discount' | 'tax' | 'cost';
  revGroup?: 'bar' | 'kitchen' | null;
  kind?: 'tax' | 'charge' | null;
  costGroup?: 'bar' | 'kitchen' | 'nc' | null;
  den?: string | null;
  unit?: 'currency' | 'count' | 'number' | 'percent' | null;
};

export type TemplateDepartmentInput = {
  cat: string;
  code: string;
  points: { label: string; guidance?: string | null; freeform?: boolean; code: string }[];
};

export type TemplateDetail = {
  id: string | null;
  name: string;
  metrics: TemplateMetricInput[];
  departments: TemplateDepartmentInput[];
};

export async function getTemplate(orgId: string, id: string): Promise<TemplateDetail | null> {
  const [t] = await db.select().from(templates).where(eq(templates.id, id)).limit(1);
  if (!t || t.orgId !== orgId) return null;

  const metrics = await db
    .select()
    .from(templateMetrics)
    .where(eq(templateMetrics.templateId, id))
    .orderBy(asc(templateMetrics.sortOrder));

  const departments = await db
    .select()
    .from(templateDepartments)
    .where(eq(templateDepartments.templateId, id))
    .orderBy(asc(templateDepartments.sortOrder));

  const points = await db
    .select()
    .from(templateChecklistPoints)
    .where(eq(templateChecklistPoints.templateId, id))
    .orderBy(asc(templateChecklistPoints.sortOrder));

  return {
    id: t.id,
    name: t.name,
    metrics: metrics.map((m) => ({
      metricKey: m.metricKey,
      label: m.label,
      section: m.section,
      revGroup: m.revGroup,
      kind: m.kind,
      costGroup: m.costGroup,
      den: m.den,
      unit: m.unit,
    })),
    departments: departments.map((d) => ({
      cat: d.cat,
      code: d.code,
      points: points
        .filter((p) => p.departmentId === d.id)
        .map((p) => ({ label: p.label, guidance: p.guidance, freeform: p.freeform, code: p.code })),
    })),
  };
}
