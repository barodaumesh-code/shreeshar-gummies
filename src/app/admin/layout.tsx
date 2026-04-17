import Link from 'next/link';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { Package, Home, Box } from 'lucide-react';
import AdminLogoutButton from '@/components/AdminLogoutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // allow login page through without auth
  const authed = await isAdminAuthenticated();

  return (
    <div className="min-h-[80vh] bg-bone">
      {authed ? (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-ink/10">
            <div className="flex items-center gap-8">
              <Link href="/admin/orders" className="font-display text-2xl italic">
                shreeshar <span className="text-xs tracking-widest uppercase not-italic font-sans text-ink-60 ml-2">Admin</span>
              </Link>
              <nav className="flex gap-6 text-sm">
                <Link href="/admin/orders" className="link-underline flex items-center gap-2">
                  <Package size={14} /> Orders
                </Link>
                <Link href="/admin/products" className="link-underline flex items-center gap-2">
                  <Box size={14} /> Products
                </Link>
                <Link href="/" className="link-underline flex items-center gap-2">
                  <Home size={14} /> Store
                </Link>
              </nav>
            </div>
            <AdminLogoutButton />
          </div>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
