'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { outlets } from '@/db/schema';
import { requireRole } from '@/lib/auth';
import { getOrCreateDefaultBrand } from '@/lib/queries/restaurants';

export type CreateRestaurantState = { error?: string; created?: string };

// A2: a name and city added inline appear in the list immediately; an empty name is refused.
export async function createRestaurant(
  _prev: CreateRestaurantState,
  formData: FormData,
): Promise<CreateRestaurantState> {
  const admin = await requireRole('super_admin');
  const name = String(formData.get('name') ?? '').trim();
  const city = String(formData.get('city') ?? '').trim();

  if (!name) return { error: 'Enter a restaurant name' };

  const brandId = await getOrCreateDefaultBrand(admin.orgId);
  await db.insert(outlets).values({ orgId: admin.orgId, brandId, name, city: city || null });

  revalidatePath('/admin/restaurants');
  return { created: name };
}
