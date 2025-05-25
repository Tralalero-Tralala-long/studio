
"use client";

import type React from 'react';
import { createContext, useContext, useState, useMemo, useEffect }from 'react';
import { auth, db } from '@/lib/firebase/config'; // Import db
import { signOut as firebaseSignOut, type User as FirebaseUser } from 'firebase/auth';
import { collection, doc, setDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore'; // Firestore imports
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

export type Mode = 'shopping' | 'gaming';

export interface PromoExample {
  id: string; // Ensure ID is always a string, critical for Firestore doc IDs
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
  savedCouponIds: string[];
  saveCoupon: (promo: PromoExample) => Promise<void>;
  unsaveCoupon: (promoId: string) => Promise<void>;
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
  const isActuallyMobile = useIsMobile();
  const [manualMobileModeOverride, setManualMobileModeOverrideState] = useState<ManualMobileModeOverride>('auto');
  const [isMobileViewActive, setIsMobileViewActive] = useState<boolean>(false);

  const [savedCouponIds, setSavedCouponIds] = useState<string[]>([]);

  const fetchSavedCouponIds = async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        const q = query(collection(db, "userCoupons", firebaseUser.uid, "savedCodes"));
        const querySnapshot = await getDocs(q);
        const ids = querySnapshot.docs.map(doc => doc.id);
        setSavedCouponIds(ids);
      } catch (error) {
        console.error("Error fetching saved coupon IDs: ", error);
        // Optionally show a toast error
      }
    } else {
      setSavedCouponIds([]);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
      setUserState(firebaseUser); // Set user state first
      if (firebaseUser) {
        setIsAuthenticatedState(true);
        const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User";
        const userEmail = firebaseUser.email;
        setUsernameState(displayName);
        setEmailState(userEmail);
        fetchSavedCouponIds(firebaseUser); // Fetch saved codes for the logged-in user

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
        setIsAuthenticatedState(false);
        setUsernameState(null);
        setEmailState(null);
        setIsDeveloperModeState(false);
        setSavedCouponIds([]); // Clear saved codes on logout
        localStorage.setItem('promoPulseIsAuthenticated', JSON.stringify(false));
        localStorage.removeItem('promoPulseUsername');
        localStorage.removeItem('promoPulseEmail');
        localStorage.setItem('promoPulseIsDeveloperMode', JSON.stringify(false));
      }
    });

    // Load other settings from localStorage
    const storedMode = localStorage.getItem('promoPulseMode') as Mode | null;
    if (storedMode) {
        setModeState(storedMode);
    }
    const storedDealAlerts = localStorage.getItem('promoPulseDealAlerts');
    if (storedDealAlerts) setDealAlerts(JSON.parse(storedDealAlerts));
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
    } else {
      setIsMobileViewActive(isActuallyMobile === undefined ? false : isActuallyMobile);
    }
  }, [manualMobileModeOverride, isActuallyMobile]);

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem('promoPulseMode', newMode);
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
      // onAuthStateChanged will handle clearing user state and savedCouponIds
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

  const saveCoupon = async (promo: PromoExample) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to save coupons.", variant: "destructive" });
      return;
    }
    try {
      const promoRef = doc(db, "userCoupons", user.uid, "savedCodes", promo.id);
      await setDoc(promoRef, promo);
      setSavedCouponIds(prev => [...new Set([...prev, promo.id])]); // Add to local state and ensure uniqueness
      toast({ title: "Coupon Saved!", description: `"${promo.title}" has been saved to My Coupons.` });
    } catch (error: any) {
      console.error("Error saving coupon: ", error);
      toast({ title: "Save Error", description: error.message || "Could not save coupon.", variant: "destructive" });
    }
  };

  const unsaveCoupon = async (promoId: string) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to manage coupons.", variant: "destructive" });
      return;
    }
    try {
      const promoRef = doc(db, "userCoupons", user.uid, "savedCodes", promoId);
      await deleteDoc(promoRef);
      setSavedCouponIds(prev => prev.filter(id => id !== promoId)); // Remove from local state
      toast({ title: "Coupon Unsaved", description: "The coupon has been removed from My Coupons." });
    } catch (error: any) {
      console.error("Error unsaving coupon: ", error);
      toast({ title: "Unsave Error", description: error.message || "Could not unsave coupon.", variant: "destructive" });
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
    manualMobileModeOverride,
    setManualMobileModeOverride: handleSetManualMobileModeOverride,
    isMobileViewActive,
    savedCouponIds,
    saveCoupon,
    unsaveCoupon,
  }), [
      mode, dealAlerts, isAuthenticated, user, username, email, isDeveloperMode,
      manualMobileModeOverride, isMobileViewActive, savedCouponIds, toast // Added savedCouponIds and toast
    ]
  );

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
