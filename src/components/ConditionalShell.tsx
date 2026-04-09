"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NotificationBell from '@/components/NotificationBell';
import PWAInstallBanner from '@/components/PWAInstallBanner';
import { User } from '@/lib/server/user';

const SHELL_EXCLUDED = ['/admin', '/org-admin', '/login'];

export default function ConditionalShell({ user, children }: { user: User | null; children: React.ReactNode }) {
  const pathname = usePathname();
  const hideShell = SHELL_EXCLUDED.some((p) => pathname === p || pathname.startsWith(p + '/'));

  return (
    <>
      {!hideShell && <Navbar user={user} />}
      {children}
      {!hideShell && <Footer />}
      {!hideShell && <NotificationBell />}
      <PWAInstallBanner />
    </>
  );
}
