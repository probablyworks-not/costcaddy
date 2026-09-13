import { requireRole } from '@/lib/auth';
import { listAuditors } from '@/lib/queries/auditors';
import { listOutletOptions } from '@/lib/queries/restaurants';
import { AuditorsClient } from './AuditorsClient';

// A3 — Auditors.
export default async function AuditorsPage() {
  const admin = await requireRole('super_admin');
  const [auditors, outlets] = await Promise.all([listAuditors(admin.orgId), listOutletOptions(admin.orgId)]);

  return <AuditorsClient auditors={auditors} outlets={outlets} />;
}
