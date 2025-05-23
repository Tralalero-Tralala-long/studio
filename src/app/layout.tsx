
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Orbitron, Rajdhani } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/contexts/AppContext';
import { Toaster } from "@/components/ui/toaster";
import AppShell from '@/components/layout/AppShell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  weight: ['400', '700'],
});

const rajdhani = Rajdhani({
  variable: '--font-rajdhani',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'PromoPulse',
  description: 'Scan websites for promo codes from shopping and gaming platforms.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${rajdhani.variable}`}>
      <body className="antialiased">
        <AppProvider>
          <AppShell>
            {children}
          </AppShell>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
