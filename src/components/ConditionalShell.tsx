import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NotificationBell from '@/components/NotificationBell';
import PWAInstallBanner from '@/components/PWAInstallBanner';

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <NotificationBell />
      <PWAInstallBanner />
    </>
  );
}
