
"use client";

import type React from 'react';
import { createContext, useContext, useState, useMemo, useEffect }from 'react';

export type Mode = 'normal' | 'gaming';

interface AppContextProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  dealAlerts: boolean;
  setDealAlerts: (enabled: boolean) => void;
  toggleMode: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>('normal');
  const [dealAlerts, setDealAlerts] = useState<boolean>(false);

  useEffect(() => {
    // Persist mode preference
    const storedMode = localStorage.getItem('promoPulseMode') as Mode | null;
    if (storedMode) {
      setModeState(storedMode);
    }
    // Persist deal alerts preference
    const storedDealAlerts = localStorage.getItem('promoPulseDealAlerts');
    if (storedDealAlerts) {
      setDealAlerts(JSON.parse(storedDealAlerts));
    }
  }, []);

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem('promoPulseMode', newMode);
    if (newMode === 'gaming') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('font-geist-sans');
      document.documentElement.classList.add('font-orbitron'); // Or Rajdhani as preferred default for gaming
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.remove('font-orbitron');
      document.documentElement.classList.remove('font-rajdhani');
      document.documentElement.classList.add('font-geist-sans');
    }
  };
  
  const toggleMode = () => {
    setMode(mode === 'normal' ? 'gaming' : 'normal');
  };

  const handleSetDealAlerts = (enabled: boolean) => {
    setDealAlerts(enabled);
    localStorage.setItem('promoPulseDealAlerts', JSON.stringify(enabled));
  };

  const contextValue = useMemo(() => ({
    mode,
    setMode,
    dealAlerts,
    setDealAlerts: handleSetDealAlerts,
    toggleMode,
  }), [mode, dealAlerts]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
