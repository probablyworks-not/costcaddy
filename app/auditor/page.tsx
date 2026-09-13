import { redirect } from 'next/navigation';

// /auditor/(protected)/layout.tsx gates this to /auditor/login when not signed in.
export default function AuditorRoot() {
  redirect('/auditor/pending');
}
