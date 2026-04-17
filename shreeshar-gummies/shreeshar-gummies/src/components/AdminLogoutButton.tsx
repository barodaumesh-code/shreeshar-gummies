'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm flex items-center gap-2 text-ink-60 hover:text-ink"
    >
      <LogOut size={14} /> Sign out
    </button>
  );
}
