
"use client";

import type React from 'react';
import { createContext, useContext, useState, useMemo, useEffect }from 'react';
import { auth } from '@/lib/firebase/config';
import { signOut as firebaseSignOut, type User as FirebaseUser } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile'; // For auto-detection

export type Mode = 'shopping' | 'gaming';

export interface PromoExample {
  id: string;
  title: string;
  code: string;
  platform: string;
  expiry: string; 
  description: string;
  category?: string;
  game?: string;
  reward?: string;
  isUsed?: boolean;
}

export type ManualMobileModeOverride = 'auto' | 'on' | 'off';

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
  manualMobileModeOverride: ManualMobileModeOverride;
  setManualMobileModeOverride: (override: ManualMobileModeOverride) => void;
  isMobileViewActive: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>('shopping');
  const [dealAlerts, setDealAlerts] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(false);
  const [user, setUserState] = useState<FirebaseUser | null>(null); 
  const [username, setUsernameState] = useState<string | null>(null);
  const [email, setEmailState] = useState<string | null>(null);
  const [isDeveloperMode, setIsDeveloperModeState] = useState<boolean>(false);
  const { toast } = useToast();

  const isActuallyMobile = useIsMobile(); // Hook for viewport-based mobile detection
  const [manualMobileModeOverride, setManualMobileModeOverrideState] = useState<ManualMobileModeOverride>('auto');
  const [isMobileViewActive, setIsMobileViewActive] = useState<boolean>(false);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        setUserState(firebaseUser);
        setIsAuthenticatedState(true);
        const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User";
        const userEmail = firebaseUser.email;
        setUsernameState(displayName);
        setEmailState(userEmail);

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
        if (storedMode === 'gaming') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    } else {
        if (mode === 'gaming') { 
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

    const storedManualMobileOverride = localStorage.getItem('promoPulseManualMobileOverride') as ManualMobileModeOverride | null;
    if (storedManualMobileOverride) {
      setManualMobileModeOverrideState(storedManualMobileOverride);
    }

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (manualMobileModeOverride === 'on') {
      setIsMobileViewActive(true);
    } else if (manualMobileModeOverride === 'off') {
      setIsMobileViewActive(false);
    } else { // 'auto'
      setIsMobileViewActive(isActuallyMobile === undefined ? false : isActuallyMobile); // Default to false if isActuallyMobile is undefined initially
    }
  }, [manualMobileModeOverride, isActuallyMobile]);


  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem('promoPulseMode', newMode);
    if (newMode === 'gaming') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const toggleMode = () => setMode(mode === 'shopping' ? 'gaming' : 'shopping');

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

  const handleSetManualMobileModeOverride = (override: ManualMobileModeOverride) => {
    setManualMobileModeOverrideState(override);
    localStorage.setItem('promoPulseManualMobileOverride', override);
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
    manualMobileModeOverride,
    setManualMobileModeOverride: handleSetManualMobileModeOverride,
    isMobileViewActive,
  }), [mode, dealAlerts, isAuthenticated, user, username, email, isDeveloperMode, toast, manualMobileModeOverride, isMobileViewActive]);

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
