// app/layout.tsx
import './globals.css'

import { Bricolage_Grotesque, Roboto } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import { ReactLenis } from 'lenis/react';
import ConditionalShell from '@/components/ConditionalShell';
import { GridsBg } from '@/components/GridsBg';
import ScrollToTop from '@/components/ScrollToTop';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-bricolage',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bricolage.variable} ${roboto.variable}`}>
      <head />
      <body suppressHydrationWarning>
        <ReactLenis root />
        <ThemeProvider>
          <GridsBg />
          <ScrollToTop />
          <ScrollToTopButton />
          <ConditionalShell>
            {children}
          </ConditionalShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
