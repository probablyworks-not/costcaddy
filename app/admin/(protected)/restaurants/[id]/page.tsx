import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { getRestaurant } from '@/lib/queries/restaurants';
import { activeAudits, listOutletAudits } from '@/lib/queries/audits';
import { listTemplates } from '@/lib/queries/templates';
import { listActiveAuditors } from '@/lib/queries/auditors';
import { CopyLinkButton } from './CopyLinkButton';
import { auditUrl } from './auditUrl';
import { AuditsHeader } from './AuditsHeader';

export default async function RestaurantDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const admin = await requireRole('super_admin');

  const restaurant = await getRestaurant(admin.orgId, id);
  if (!restaurant) notFound();

  const isReports = tab === 'reports';
  const [audits, templates, auditors] = await Promise.all([
    listOutletAudits(admin.orgId, id),
    listTemplates(admin.orgId),
    listActiveAuditors(admin.orgId),
  ]);
  const active = activeAudits(audits);
  const publishedCount = audits.filter((a) => a.status === 'published').length;

  return (
    <div>
      <Link
        href="/admin/restaurants"
        style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 'var(--space-7)', display: 'inline-block' }}
      >
        &lsaquo; All restaurants
      </Link>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid var(--divider)',
          paddingBottom: 'var(--space-9)',
          marginBottom: 'var(--space-10)',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-ui-title)', fontSize: 'var(--text-screen-title)', fontWeight: 600 }}>
            {restaurant.name}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 3 }}>{restaurant.city}</div>
        </div>
      </div>

      <AuditsHeader
        outletId={id}
        isReports={isReports}
        activeCount={active.length}
        publishedCount={publishedCount}
        templates={templates}
        auditors={auditors}
      />

      {!isReports ? (
        <div>
          <div
            style={{
              fontSize: 11,
              color: 'var(--muted-2)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              margin: '18px 0 10px 0',
            }}
          >
            Active audits
          </div>
          {active.length === 0 && (
            <div style={{ color: 'var(--placeholder)', fontSize: 13, padding: '6px 0 30px 0' }}>
              No active audits — create one to get a shareable link.
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-7)' }}>
            {active.map((a) => (
              <div key={a.id} style={{ border: '1px solid var(--divider)', borderRadius: 'var(--radius-card)', padding: '15px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{a.name || a.templateName}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
                      Auditor {a.auditorName} · Due {a.dueDate}
                    </div>
                  </div>
                  <StatusChip status={a.status} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 220,
                      fontFamily: 'var(--font-ui-mono)',
                      fontSize: 12,
                      color: 'var(--ink-3)',
                      background: 'var(--surface)',
                      border: '1px solid var(--border-strong)',
                      borderRadius: 'var(--radius-control)',
                      padding: '9px 11px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {auditUrl(a.token)}
                  </div>
                  <CopyLinkButton token={a.token} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ color: 'var(--placeholder)', fontSize: 13 }}>
          Report generation ships with the C-series packages — nothing to show yet.
        </div>
      )}
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; border: string; label: string }> = {
    assigned: { bg: 'var(--surface)', color: 'var(--ink-3)', border: 'var(--border)', label: 'ASSIGNED' },
    'in-progress': { bg: '#fffbeb', color: '#b45309', border: '#fde68a', label: 'IN PROGRESS' },
    submitted: { bg: 'var(--navy-chip)', color: 'var(--navy-700)', border: 'var(--navy-border)', label: 'SUBMITTED' },
    published: { bg: 'var(--navy-700)', color: 'var(--surface)', border: 'var(--navy-700)', label: 'PUBLISHED' },
  };
  const chip = map[status] ?? map.assigned;
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.06em',
        padding: '5px 9px',
        borderRadius: 'var(--radius-pill)',
        background: chip.bg,
        color: chip.color,
        border: `1px solid ${chip.border}`,
      }}
    >
      {chip.label}
    </div>
  );
}
