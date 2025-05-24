
"use client";

import type React from 'react';
import { createContext, useContext, useState, useMemo, useEffect }from 'react';
import { auth } from '@/lib/firebase/config'; // Firebase auth instance
import { signOut as firebaseSignOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast'; // For sign-out error feedback

export type Mode = 'normal' | 'gaming';

export interface PromoExample {
  id: string; // Changed to string for potentially UUIDs or Date.now().toString()
  title: string;
  code: string;
  platform: string; // For Normal mode: E-commerce, Delivery, Referral. For Gaming: specific game name or general category
  expiry: string; // Keep as string, can be 'N/A' or formatted date
  description: string;
  category?: string; // e.g., 'game_code', 'e-commerce_discount'
  game?: string; // Specific game name for Roblox sub-wallets or other gaming codes
}

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
  signOut: () => Promise<void>;
  isDeveloperMode: boolean;
  setIsDeveloperMode: (isDev: boolean) => void;
  promoExamples: PromoExample[];
  addPromoExample: (newPromo: Omit<PromoExample, 'id'>) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Initial promo examples - will be loaded from localStorage or use this as default
const initialPromoExamples: PromoExample[] = [
  { id: "2", title: "Free Delivery", code: "FREEDEL", platform: "Delivery", expiry: "N/A", description: "Enjoy free delivery on orders over $25." },
  { id: "3", title: "$10 Referral Bonus", code: "REF10", platform: "Referral", expiry: "N/A", description: "Refer a friend and you both get $10." },
  { id: "7", title: "Generic Roblox Gems", code: "ROBLOXGEM", platform: "Roblox Codes", expiry: "2025-01-01", description: "Get 100 free gems for your Roblox account!", category: "game_code", game: "Generic Roblox" },
];


export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>('normal');
  const [dealAlerts, setDealAlerts] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(false);
  const [username, setUsernameState] = useState<string | null>(null);
  const [email, setEmailState] = useState<string | null>(null);
  const [isDeveloperMode, setIsDeveloperModeState] = useState<boolean>(false);
  const [promoExamples, setPromoExamplesState] = useState<PromoExample[]>(initialPromoExamples);
  const { toast } = useToast();

  useEffect(() => {
    // Load auth state from Firebase
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
        setIsDeveloperModeState(false); // Ensure dev mode is off if not authenticated
        localStorage.setItem('promoPulseIsAuthenticated', JSON.stringify(false));
        localStorage.removeItem('promoPulseUsername');
        localStorage.removeItem('promoPulseEmail');
        localStorage.setItem('promoPulseIsDeveloperMode', JSON.stringify(false));
      }
    });

    // Load other preferences from localStorage
    const storedMode = localStorage.getItem('promoPulseMode') as Mode | null;
    if (storedMode) setModeState(storedMode);
    
    const storedDealAlerts = localStorage.getItem('promoPulseDealAlerts');
    if (storedDealAlerts) setDealAlerts(JSON.parse(storedDealAlerts));

    const storedIsDeveloperMode = localStorage.getItem('promoPulseIsDeveloperMode');
    if (storedIsDeveloperMode) setIsDeveloperModeState(JSON.parse(storedIsDeveloperMode));

    const storedPromoExamples = localStorage.getItem('promoPulsePromoExamples');
    if (storedPromoExamples) {
      try {
        setPromoExamplesState(JSON.parse(storedPromoExamples));
      } catch (e) {
        console.error("Failed to parse promo examples from localStorage", e);
        setPromoExamplesState(initialPromoExamples); // Fallback to initial if parsing fails
      }
    } else {
       setPromoExamplesState(initialPromoExamples); // Initialize if not in localStorage
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
  
  const toggleMode = () => setMode(mode === 'normal' ? 'gaming' : 'normal');

  const handleSetDealAlerts = (enabled: boolean) => {
    setDealAlerts(enabled);
    localStorage.setItem('promoPulseDealAlerts', JSON.stringify(enabled));
  };

  const handleSetIsAuthenticated = (isAuth: boolean) => {
    setIsAuthenticatedState(isAuth);
    localStorage.setItem('promoPulseIsAuthenticated', JSON.stringify(isAuth));
    if (!isAuth) { // If logging out, also disable developer mode
      handleSetIsDeveloperMode(false);
    }
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
      // Auth state listener will handle setIsAuthenticated, setUsername, setEmail
      handleSetIsDeveloperMode(false); // Explicitly turn off dev mode on sign out
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

  const addPromoExample = (newPromoData: Omit<PromoExample, 'id'>) => {
    const newPromo: PromoExample = {
      ...newPromoData,
      id: Date.now().toString(), // Simple ID generation
    };
    setPromoExamplesState(prevPromos => {
      const updatedPromos = [...prevPromos, newPromo];
      localStorage.setItem('promoPulsePromoExamples', JSON.stringify(updatedPromos));
      return updatedPromos;
    });
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
    signOut: performSignOut,
    isDeveloperMode,
    setIsDeveloperMode: handleSetIsDeveloperMode,
    promoExamples,
    addPromoExample,
  }), [mode, dealAlerts, isAuthenticated, username, email, isDeveloperMode, promoExamples, toast]);

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
