import { getAuditForReview, listOperationalFiles, type ReviewAuditDetail } from '@/lib/queries/review';
import { getAuditItemFiles, getAuditItems, getAuditMetricDefs, getAuditMetricValues } from '@/lib/queries/audits';
import { buildFinancialReportDraft, type FinancialReportDraft } from './financialDraft';
import { buildCostingBreakdown, type CostingBreakdown } from './costingBreakdown';
import { figureValue } from './figure';
import type { DonutSlice } from '@/app/admin/(protected)/review/[id]/report/CompositionDonut';
import type { ComplianceItem, Department } from '@/app/admin/(protected)/review/[id]/report/ComplianceSection';

export interface ReportViewModel {
  audit: ReviewAuditDetail;
  draft: FinancialReportDraft;
  costing: CostingBreakdown;
  departments: Department[];
  salesSlices: DonutSlice[];
  costSlices: DonutSlice[];
}

// Shared between the interactive review-screen report page and C5's Playwright PDF
// render, so the two can never drift into showing different figures for the same
// audit. Does real I/O (unlike C2/C3's pure modules) — this is the assembly layer.
export async function loadReportViewModel(orgId: string, auditId: string): Promise<ReportViewModel | null> {
  const audit = await getAuditForReview(orgId, auditId);
  if (!audit) return null;

  const [defs, values, items, itemFiles, opFiles] = await Promise.all([
    getAuditMetricDefs(auditId),
    getAuditMetricValues(auditId),
    getAuditItems(auditId),
    getAuditItemFiles(auditId),
    listOperationalFiles(auditId),
  ]);

  const draft = buildFinancialReportDraft(
    defs,
    values,
    opFiles.map((f) => ({ type: f.type, period: f.period, parsed: f.parseStatus === 'parsed', coverageSummary: f.coverageSummary })),
  );
  const costing = buildCostingBreakdown(defs, values);

  const departments: Department[] = [];
  for (const it of items) {
    let dept = departments.find((d) => d.cat === it.cat);
    if (!dept) {
      dept = { cat: it.cat, catCode: it.catCode, items: [] };
      departments.push(dept);
    }
    const complianceItem: ComplianceItem = {
      id: it.id,
      refId: it.refId ?? it.code,
      label: it.label,
      observation: it.status === 'na' ? (it.naReason ?? '') : it.remark,
      status: it.status,
      category: it.category,
      severity: it.severity,
      impact: it.impact,
      correctiveAction: it.correctiveAction,
      sla: it.sla,
      photoCount: itemFiles.filter((f) => f.auditItemId === it.id).length,
    };
    dept.items.push(complianceItem);
  }

  const kitchenNet = figureValue(draft.revenueMatrix.rows.find((r) => r.key === 'kitchen')?.netSales ?? { status: 'needs-data' });
  const barNet = figureValue(draft.revenueMatrix.rows.find((r) => r.key === 'bar')?.netSales ?? { status: 'needs-data' });
  const taxes = figureValue(draft.kpis.totalTaxes);
  const charges = figureValue(draft.kpis.totalCharges);
  const salesSlices: DonutSlice[] = [
    { label: 'Kitchen', value: kitchenNet ?? 0, color: 'var(--status-pass-bg-deep)' },
    { label: 'Bar', value: barNet ?? 0, color: 'var(--status-pass-fg)' },
    { label: 'Service charge', value: charges ?? 0, color: 'var(--report-chart-teal-4)' },
    { label: 'Statutory taxes', value: taxes ?? 0, color: 'var(--report-chart-teal-5)' },
  ];

  const barCost = figureValue(costing.bar?.total ?? { status: 'needs-data' });
  const kitchenCost = figureValue(costing.kitchen?.total ?? { status: 'needs-data' });
  const ncCost = figureValue(costing.nonCommercial[0]?.value ?? { status: 'needs-data' });
  const costSlices: DonutSlice[] = [
    { label: 'Bar & Cellar cost', value: barCost ?? 0, color: 'var(--report-chart-rust-1)' },
    { label: 'Kitchen & Production cost', value: kitchenCost ?? 0, color: 'var(--report-chart-rust-2)' },
    { label: 'Non-commercial cost', value: ncCost ?? 0, color: 'var(--report-chart-rust-4)' },
  ];

  return { audit, draft, costing, departments, salesSlices, costSlices };
}
