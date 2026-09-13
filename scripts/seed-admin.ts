// One-off dev helper: creates an org + a first super_admin so /admin/login has an
// account to sign in with. Idempotent on org name — running twice against the same
// org just adds another admin if the email differs, and refuses a duplicate email.
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { orgs, users } from '@/db/schema';
import { hashPassword, generatePassword } from '@/lib/auth';

const ORG_NAME = process.env.SEED_ORG_NAME ?? 'F&B Controller';
const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? 'Platform Owner';
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@fnbcontroller.com';

async function main() {
  const [existingUser] = await db.select().from(users).where(eq(users.email, ADMIN_EMAIL)).limit(1);
  if (existingUser) {
    console.log(`A user with email ${ADMIN_EMAIL} already exists (id ${existingUser.id}) — nothing to do.`);
    return;
  }

  let [org] = await db.select().from(orgs).where(eq(orgs.name, ORG_NAME)).limit(1);
  if (!org) {
    [org] = await db.insert(orgs).values({ name: ORG_NAME }).returning();
  }

  const password = generatePassword();
  const pwdHash = await hashPassword(password);
  const [admin] = await db
    .insert(users)
    .values({
      orgId: org.id,
      role: 'super_admin',
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      pwdHash,
      mustChangePassword: false,
    })
    .returning();

  console.log('Super admin created — this password is shown once, save it now:');
  console.log(`  email:    ${admin.email}`);
  console.log(`  password: ${password}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to seed admin:', error);
    process.exit(1);
  });
