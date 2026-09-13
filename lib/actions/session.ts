'use server';

import { redirect } from 'next/navigation';
import { signOut } from '@/lib/auth';

export async function logout(): Promise<void> {
  await signOut();
  redirect('/admin/login');
}

export async function auditorLogout(): Promise<void> {
  await signOut();
  redirect('/auditor/login');
}
