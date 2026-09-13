import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { getTemplate } from '@/lib/queries/templates';
import { TemplateBuilder } from '../TemplateBuilder';

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = await requireRole('super_admin');
  const template = await getTemplate(admin.orgId, id);
  if (!template) notFound();
  return <TemplateBuilder initial={template} />;
}
