export { hashPassword, verifyPassword, generatePassword } from './password';
export { createSession, getSession, deleteSession, endAllSessions } from './session';
export { setSessionCookie, clearSessionCookie, readSessionCookie, SESSION_COOKIE_NAME } from './cookies';
export { getCurrentUser, requireRole, type Role } from './rbac';
export { verifyCredentials } from './login';
export {
  createAuditor,
  resetPassword,
  forceSignOut,
  setAuditorStatus,
  DuplicateEmailError,
} from './accounts';

import { clearSessionCookie, readSessionCookie, setSessionCookie } from './cookies';
import { createSession, deleteSession } from './session';
import type { User } from '@/db/schema';

// Verifies credentials elsewhere (verifyCredentials), then call this to open the session.
export async function signIn(user: User): Promise<void> {
  const { cookieValue, expiresAt } = await createSession(user.id, user.orgId);
  await setSessionCookie(cookieValue, expiresAt);
}

export async function signOut(): Promise<void> {
  const cookieValue = await readSessionCookie();
  if (cookieValue) await deleteSession(cookieValue);
  await clearSessionCookie();
}
