
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
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuth: boolean) => void;
  username: string | null;
  setUsername: (name: string | null) => void;
  email: string | null;
  setEmail: (email: string | null) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>('normal');
  const [dealAlerts, setDealAlerts] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(false);
  const [username, setUsernameState] = useState<string | null>(null);
  const [email, setEmailState] = useState<string | null>(null);

  useEffect(() => {
    const storedMode = localStorage.getItem('promoPulseMode') as Mode | null;
    if (storedMode) {
      setModeState(storedMode);
    }
    const storedDealAlerts = localStorage.getItem('promoPulseDealAlerts');
    if (storedDealAlerts) {
      setDealAlerts(JSON.parse(storedDealAlerts));
    }
    const storedAuth = localStorage.getItem('promoPulseIsAuthenticated');
    if (storedAuth) {
      setIsAuthenticatedState(JSON.parse(storedAuth));
    }
    const storedUsername = localStorage.getItem('promoPulseUsername');
    if (storedUsername) {
      setUsernameState(storedUsername);
    }
    const storedEmail = localStorage.getItem('promoPulseEmail');
    if (storedEmail) {
      setEmailState(storedEmail);
    }
  }, []);

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem('promoPulseMode', newMode);
    if (newMode === 'gaming') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('font-geist-sans');
      document.documentElement.classList.add('font-orbitron');
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

  const handleSetIsAuthenticated = (isAuth: boolean) => {
    setIsAuthenticatedState(isAuth);
    localStorage.setItem('promoPulseIsAuthenticated', JSON.stringify(isAuth));
  };

  const handleSetUsername = (name: string | null) => {
    setUsernameState(name);
    if (name) {
      localStorage.setItem('promoPulseUsername', name);
    } else {
      localStorage.removeItem('promoPulseUsername');
    }
  };

  const handleSetEmail = (addr: string | null) => {
    setEmailState(addr);
    if (addr) {
      localStorage.setItem('promoPulseEmail', addr);
    } else {
      localStorage.removeItem('promoPulseEmail');
    }
  };

  const contextValue = useMemo(() => ({
    mode,
    setMode,
    dealAlerts,
    setDealAlerts: handleSetDealAlerts,
    toggleMode,
    isAuthenticated,
    setIsAuthenticated: handleSetIsAuthenticated,
    username,
    setUsername: handleSetUsername,
    email,
    setEmail: handleSetEmail,
  }), [mode, dealAlerts, isAuthenticated, username, email]);

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
