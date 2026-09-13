import { redirect } from 'next/navigation';

// A1: the root path lands on the Super Admin console — /admin/layout.tsx gates it to
// /admin/login when not signed in. (The F2 smoke test previously here is gone; every
// primitive it exercised is now used for real across the /admin/* screens.)
export default function Home() {
  redirect('/admin/restaurants');
}
