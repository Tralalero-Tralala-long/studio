
"use client";

import type React from 'react';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import Header from '@/components/layout/Header';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { mode, isMobileViewActive } = useAppContext();
  const [currentYear, setCurrentYear] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  useEffect(() => {
    if (isMounted) { 
      if (mode === 'gaming') {
        document.documentElement.classList.add('dark');
        document.body.classList.remove('font-geist-sans');
        document.body.classList.add('font-orbitron');
        document.body.style.fontFamily = 'var(--font-orbitron)';
      } else { 
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('font-orbitron');
        document.body.classList.remove('font-rajdhani');
        document.body.classList.add('font-geist-sans');
        document.body.style.fontFamily = 'var(--font-geist-sans)';
      }

      // Apply/remove global class for mobile view compactness
      if (isMobileViewActive) {
        document.documentElement.classList.add('mobile-view-active');
      } else {
        document.documentElement.classList.remove('mobile-view-active');
      }
    }
  }, [mode, isMounted, isMobileViewActive]);

  return (
    <div className={`min-h-screen flex flex-col ${isMounted && (mode === 'gaming' ? 'font-orbitron' : 'font-geist-sans')}`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        {isMounted ? `© ${currentYear} PromoPulse. All rights reserved.` : `© PromoPulse. All rights reserved.`}
      </footer>
    </div>
  );
}
