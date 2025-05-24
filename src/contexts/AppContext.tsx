
"use client";

import type React from 'react';
import { createContext, useContext, useState, useMemo, useEffect }from 'react';
import { auth } from '@/lib/firebase/config'; // Firebase auth instance
import { signOut as firebaseSignOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast'; // For sign-out error feedback

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
  signOut: () => Promise<void>; // signOut is now async
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>('normal');
  const [dealAlerts, setDealAlerts] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(false);
  const [username, setUsernameState] = useState<string | null>(null);
  const [email, setEmailState] = useState<string | null>(null);
  const { toast } = useToast(); // For error feedback

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsAuthenticatedState(true);
        setUsernameState(user.displayName || user.email?.split('@')[0] || "User");
        setEmailState(user.email);
        localStorage.setItem('promoPulseIsAuthenticated', JSON.stringify(true));
        if (user.displayName) localStorage.setItem('promoPulseUsername', user.displayName);
        if (user.email) localStorage.setItem('promoPulseEmail', user.email);
      } else {
        setIsAuthenticatedState(false);
        setUsernameState(null);
        setEmailState(null);
        localStorage.setItem('promoPulseIsAuthenticated', JSON.stringify(false));
        localStorage.removeItem('promoPulseUsername');
        localStorage.removeItem('promoPulseEmail');
      }
    });

    // Load other preferences from localStorage
    const storedMode = localStorage.getItem('promoPulseMode') as Mode | null;
    if (storedMode) {
      setModeState(storedMode);
    }
    const storedDealAlerts = localStorage.getItem('promoPulseDealAlerts');
    if (storedDealAlerts) {
      setDealAlerts(JSON.parse(storedDealAlerts));
    }
    
    return () => unsubscribe(); // Cleanup subscription on unmount
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

  // These direct setters might be less used if Firebase auth state is the source of truth,
  // but keeping them for potential manual override or non-Firebase auth parts.
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

  const performSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      // Auth state change listener will automatically update isAuthenticated, username, email
      // and clear localStorage.
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      console.error("Error signing out: ", error);
      toast({
        title: "Sign-Out Error",
        description: error.message || "Could not sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const contextValue = useMemo(() => ({
    mode,
    setMode,
    dealAlerts,
    setDealAlerts: handleSetDealAlerts,
    toggleMode,
    isAuthenticated,
    setIsAuthenticated: handleSetIsAuthenticated, // Keep for manual control if needed
    username,
    setUsername: handleSetUsername, // Keep for manual control
    email,
    setEmail: handleSetEmail, // Keep for manual control
    signOut: performSignOut,
  }), [mode, dealAlerts, isAuthenticated, username, email, toast]); // Added toast to dependencies

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
