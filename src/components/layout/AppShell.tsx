
"use client";

import type React from 'react';
import { useEffect, useState } from 'react'; // Added useState
import { useAppContext } from '@/contexts/AppContext';
import Header from '@/components/layout/Header';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { mode } = useAppContext();
  const [currentYear, setCurrentYear] = useState<number | string>(''); // State for the year

  useEffect(() => {
    if (mode === 'gaming') {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('font-geist-sans');
      document.body.classList.add('font-orbitron'); 
    } else { // mode === 'shopping'
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('font-orbitron');
      document.body.classList.remove('font-rajdhani'); // Ensure Rajdhani is also removed if it was applied
      document.body.classList.add('font-geist-sans');
    }
    // Ensure body always has a font family set via style as a fallback or explicit override
    document.body.style.fontFamily = mode === 'gaming' ? 'var(--font-orbitron)' : 'var(--font-geist-sans)';

  }, [mode]);

  useEffect(() => {
    // Set the year only on the client, after hydration
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${mode === 'gaming' ? 'font-orbitron' : 'font-geist-sans'}`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {currentYear} PromoPulse. All rights reserved.
      </footer>
    </div>
  );
}
