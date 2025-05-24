
"use client";

import type React from 'react';
import { createContext, useContext, useState, useMemo, useEffect }from 'react';
import { auth } from '@/lib/firebase/config'; // Firebase auth instance
import { signOut as firebaseSignOut, type User as FirebaseUser } from 'firebase/auth'; // Renamed User to FirebaseUser
import { useToast } from '@/hooks/use-toast';

export type Mode = 'shopping' | 'gaming'; // Changed 'normal' to 'shopping'

// Defined here as it's used by the AddCodeForm and pages
export interface PromoExample {
  id: string;
  title: string;
  code: string;
  platform: string;
  expiry: string; // Formatted date string or "Not specified"
  description: string;
  category?: string;
  game?: string;
  isUsed?: boolean; // Added for "mark as used" feature
}

interface AppContextProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  dealAlerts: boolean;
  setDealAlerts: (enabled: boolean) => void;
  toggleMode: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuth: boolean) => void; 
  user: FirebaseUser | null; 
  setUser: (user: FirebaseUser | null) => void; 
  username: string | null; 
  setUsername: (name: string | null) => void;
  email: string | null; 
  setEmail: (email: string | null) => void;
  signOut: () => Promise<void>;
  isDeveloperMode: boolean;
  setIsDeveloperMode: (isDev: boolean) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>('shopping'); // Default to 'shopping'
  const [dealAlerts, setDealAlerts] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(false);
  const [user, setUserState] = useState<FirebaseUser | null>(null); 
  const [username, setUsernameState] = useState<string | null>(null);
  const [email, setEmailState] = useState<string | null>(null);
  const [isDeveloperMode, setIsDeveloperModeState] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        setUserState(firebaseUser);
        setIsAuthenticatedState(true);
        const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User";
        const userEmail = firebaseUser.email;
        setUsernameState(displayName);
        setEmailState(userEmail);

        // Developer mode check
        if (userEmail === "virajdatla0204@gmail.com") {
          setIsDeveloperModeState(true);
          localStorage.setItem('promoPulseIsDeveloperMode', JSON.stringify(true));
        } else {
          setIsDeveloperModeState(false);
          localStorage.setItem('promoPulseIsDeveloperMode', JSON.stringify(false));
        }

        localStorage.setItem('promoPulseIsAuthenticated', JSON.stringify(true));
        if (displayName) localStorage.setItem('promoPulseUsername', displayName);
        if (userEmail) localStorage.setItem('promoPulseEmail', userEmail);

      } else {
        setUserState(null);
        setIsAuthenticatedState(false);
        setUsernameState(null);
        setEmailState(null);
        setIsDeveloperModeState(false);
        localStorage.setItem('promoPulseIsAuthenticated', JSON.stringify(false));
        localStorage.removeItem('promoPulseUsername');
        localStorage.removeItem('promoPulseEmail');
        localStorage.setItem('promoPulseIsDeveloperMode', JSON.stringify(false));
      }
    });

    const storedMode = localStorage.getItem('promoPulseMode') as Mode | null;
    if (storedMode) {
        setModeState(storedMode);
        // Ensure class is applied correctly on initial load based on stored mode
        if (storedMode === 'gaming') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    } else {
        // Default to shopping mode if nothing is stored
        if (mode === 'gaming') { // current state default is shopping
             document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
    
    const storedDealAlerts = localStorage.getItem('promoPulseDealAlerts');
    if (storedDealAlerts) setDealAlerts(JSON.parse(storedDealAlerts));

    const storedIsDeveloperMode = localStorage.getItem('promoPulseIsDeveloperMode');
     if (storedIsDeveloperMode && auth.currentUser?.email === "virajdatla0204@gmail.com") {
      setIsDeveloperModeState(JSON.parse(storedIsDeveloperMode));
    } else if (storedIsDeveloperMode) {
       setIsDeveloperModeState(false);
       localStorage.setItem('promoPulseIsDeveloperMode', JSON.stringify(false));
    }


    return () => unsubscribe();
  }, []);

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem('promoPulseMode', newMode);
    if (newMode === 'gaming') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const toggleMode = () => setMode(mode === 'shopping' ? 'gaming' : 'shopping'); // Updated logic

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
    if (name) localStorage.setItem('promoPulseUsername', name);
    else localStorage.removeItem('promoPulseUsername');
  };

  const handleSetEmail = (addr: string | null) => {
    setEmailState(addr);
    if (addr) localStorage.setItem('promoPulseEmail', addr);
    else localStorage.removeItem('promoPulseEmail');
  };
  
  const handleSetIsDeveloperMode = (isDev: boolean) => {
    setIsDeveloperModeState(isDev);
    localStorage.setItem('promoPulseIsDeveloperMode', JSON.stringify(isDev));
  };

  const performSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      // State will be cleared by onAuthStateChanged listener
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
    setIsAuthenticated: handleSetIsAuthenticated,
    user,
    setUser: setUserState,
    username,
    setUsername: handleSetUsername,
    email,
    setEmail: handleSetEmail,
    signOut: performSignOut,
    isDeveloperMode,
    setIsDeveloperMode: handleSetIsDeveloperMode,
  }), [mode, dealAlerts, isAuthenticated, user, username, email, isDeveloperMode, toast]); // toast added to dependencies

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
