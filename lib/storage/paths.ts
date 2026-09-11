// Storage paths are org-scoped even though the bucket itself is private, so a future
// bucket-level policy change can't cross an org boundary by accident.
export function auditItemFilePath(orgId: string, auditItemId: string, fileId: string, filename: string): string {
  return `${orgId}/audit-items/${auditItemId}/${fileId}-${filename}`;
}

export function reportFilePath(orgId: string, auditId: string, version: number, filename: string): string {
  return `${orgId}/reports/${auditId}/v${version}/${filename}`;
}
