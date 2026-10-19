import { redirect } from 'next/navigation';

// Auto Dispatch Settings was removed (2026-10-17): MediGo admins assign every
// ride by hand. Old bookmarks to this page go back to the Dispatch overview.
export default function AutoDispatchSettings() {
  redirect('/dispatch');
}
