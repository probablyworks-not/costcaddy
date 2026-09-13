'use server';

import { redirect } from 'next/navigation';
import { signIn, verifyCredentials } from '@/lib/auth';

export type LoginState = { error?: string; email?: string };

// A1: an empty field is refused with the one message "Enter your email and password" —
// one validation message at a time. Valid credentials land on `restaurants`.
export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Enter your email and password', email };
  }

  const user = await verifyCredentials(email, password);
  if (!user || user.role !== 'super_admin') {
    return { error: 'Incorrect email or password', email };
  }

  await signIn(user);
  redirect('/admin/restaurants');
}

// B1: same one-message validation as A1, scoped to the 'auditor' role.
export async function auditorLogin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Enter your email and password', email };
  }

  const user = await verifyCredentials(email, password);
  if (!user || user.role !== 'auditor') {
    return { error: 'Incorrect email or password', email };
  }

  await signIn(user);
  redirect('/auditor/pending');
}
