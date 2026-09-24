import { notFound } from 'next/navigation';
import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { getRestaurant } from '@/lib/queries/restaurants';
import { listOutletReports, periodMonthKey } from '@/lib/queries/reports';
import { buildMtdViewModel } from '@/lib/report/mtdViewModel';
import { MtdReportBody } from './MtdReportBody';
import { PrintButton } from '@/app/admin/(protected)/review/[id]/report/PrintButton';

export default async function MtdReportPage({ params }: { params: Promise<{ id: string; month: string }> }) {
  const { id, month } = await params;
  const admin = await requireRole('super_admin');

  const restaurant = await getRestaurant(admin.orgId, id);
  if (!restaurant) notFound();

  const reports = await listOutletReports(admin.orgId, id);
  const monthReports = reports.filter((r) => periodMonthKey(r.periodStart) === month);
  if (monthReports.length === 0) notFound();

  const vm = await buildMtdViewModel(
    monthReports.map((r) => ({
      auditId: r.auditId,
      name: r.name ?? r.templateName,
      templateName: r.templateName,
      version: r.version,
      publishedAt: r.publishedAt,
    })),
  );

  const monthLabel = new Date(`${month}-15T00:00:00`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div style={{ fontFamily: 'var(--font-report-body)', color: 'var(--r-ink)', background: 'var(--r-bg)', minHeight: '100vh' }}>
      <header
        data-noprint=""
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'var(--navy-700)',
          color: '#fff',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
          boxShadow: 'var(--shadow-report-header)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
          <Link href={`/admin/restaurants/${id}?tab=reports&month=${month}`} style={{ color: '#fff', textDecoration: 'none' }}>
            &lsaquo; Back to reports
          </Link>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--navy-500)',
              padding: '2px 10px',
              borderRadius: 4,
              fontSize: 11,
              fontFamily: 'var(--font-report-mono)',
              fontWeight: 500,
            }}
          >
            MTD — LIVE
          </span>
          <span style={{ color: 'var(--navy-border-soft-2)' }}>
            {restaurant.name} · {monthLabel}
          </span>
        </div>
        <PrintButton />
      </header>

      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 1420,
          margin: '28px auto',
          padding: '36px 28px',
          background: '#fff',
          border: '1px solid var(--r-border)',
          borderRadius: 8,
          boxShadow: 'var(--shadow-card)',
          boxSizing: 'border-box',
        }}
      >
        <MtdReportBody vm={vm} restaurantName={restaurant.name} monthLabel={monthLabel} />
      </main>
    </div>
  );
}
