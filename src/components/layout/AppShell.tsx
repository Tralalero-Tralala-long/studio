
"use client";

import type React from 'react';
import { useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import Header from '@/components/layout/Header';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { mode } = useAppContext();

  useEffect(() => {
    if (mode === 'gaming') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('font-geist-sans');
      // You can choose Orbitron or Rajdhani as the primary gaming font.
      // Here, we're adding both classes and letting CSS specificity or direct application decide.
      // Or, apply one specifically: document.body.classList.add('font-orbitron');
      document.body.classList.add('font-orbitron'); 
      document.body.classList.remove('font-geist-sans');

    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('font-orbitron');
      document.body.classList.remove('font-rajdhani');
      document.body.classList.add('font-geist-sans');
    }
    // Ensure body always has a font family
    if (!document.body.style.fontFamily) {
         document.body.style.fontFamily = mode === 'gaming' ? 'var(--font-orbitron)' : 'var(--font-geist-sans)';
    }


  }, [mode]);

  return (
    <div className={`min-h-screen flex flex-col ${mode === 'gaming' ? 'font-orbitron' : 'font-geist-sans'}`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} PromoPulse. All rights reserved.
      </footer>
    </div>
  );
}
