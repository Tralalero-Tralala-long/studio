
"use client";

import type React from 'react';
import { createContext, useContext, useState, useMemo, useEffect }from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

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

// Simplified user type for local storage
interface LocalUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AppContextProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  dealAlerts: boolean;
  setDealAlerts: (enabled: boolean) => void;
  toggleMode: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuth: boolean, user?: LocalUser | null) => void; // Updated to accept user
  user: LocalUser | null;
  setUser: (user: LocalUser | null) => void;
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
  fetchSavedCouponIds: () => void; // Renamed for clarity
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const DEV_EMAIL = "virajdatla0204@gmail.com";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>('shopping');
  const [dealAlerts, setDealAlerts] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(false);
  const [user, setUserState] = useState<LocalUser | null>(null);
  const [username, setUsernameState] = useState<string | null>(null);
  const [email, setEmailState] = useState<string | null>(null);
  const [isDeveloperMode, setIsDeveloperModeState] = useState<boolean>(false);
  const { toast } = useToast();
  const isActuallyMobile = useIsMobile();
  const [manualMobileModeOverride, setManualMobileModeOverrideState] = useState<ManualMobileModeOverride>('auto');
  const [isMobileViewActive, setIsMobileViewActive] = useState<boolean>(false);
  const [savedCouponIds, setSavedCouponIds] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Load initial state from localStorage
    const storedMode = localStorage.getItem('promoPulseMode') as Mode | null;
    if (storedMode) setModeState(storedMode);

    const storedDealAlerts = localStorage.getItem('promoPulseDealAlerts');
    if (storedDealAlerts) setDealAlerts(JSON.parse(storedDealAlerts));

    const storedManualMobileOverride = localStorage.getItem('promoPulseManualMobileOverride') as ManualMobileModeOverride | null;
    if (storedManualMobileOverride) setManualMobileModeOverrideState(storedManualMobileOverride);

    const storedAuth = localStorage.getItem('promoPulseIsAuthenticated');
    const storedUserJson = localStorage.getItem('promoPulseUser');
    
    if (storedAuth && JSON.parse(storedAuth) && storedUserJson) {
      const storedUser: LocalUser = JSON.parse(storedUserJson);
      setUserState(storedUser);
      setIsAuthenticatedState(true);
      setUsernameState(storedUser.displayName);
      setEmailState(storedUser.email);
      if (storedUser.email === DEV_EMAIL) {
        setIsDeveloperModeState(true);
      }
      fetchSavedCouponIdsInternal(storedUser.uid); // Fetch coupons for this user
    }

    const storedDevMode = localStorage.getItem('promoPulseIsDeveloperMode');
    if (storedDevMode) setIsDeveloperModeState(JSON.parse(storedDevMode));

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

  const toggleMode = () => {
    const newMode = mode === 'shopping' ? 'gaming' : 'shopping';
    setMode(newMode);
    router.push('/');
  };

  const handleSetDealAlerts = (enabled: boolean) => {
    setDealAlerts(enabled);
    localStorage.setItem('promoPulseDealAlerts', JSON.stringify(enabled));
  };

  const handleSetIsAuthenticated = (isAuth: boolean, newUserData?: LocalUser | null) => {
    setIsAuthenticatedState(isAuth);
    localStorage.setItem('promoPulseIsAuthenticated', JSON.stringify(isAuth));
    if (isAuth && newUserData) {
      setUserState(newUserData);
      setUsernameState(newUserData.displayName);
      setEmailState(newUserData.email);
      localStorage.setItem('promoPulseUser', JSON.stringify(newUserData));
      if (newUserData.email === DEV_EMAIL) {
        setIsDeveloperModeState(true);
        localStorage.setItem('promoPulseIsDeveloperMode', JSON.stringify(true));
      } else {
        setIsDeveloperModeState(false);
        localStorage.setItem('promoPulseIsDeveloperMode', JSON.stringify(false));
      }
      fetchSavedCouponIdsInternal(newUserData.uid);
    } else if (!isAuth) {
      setUserState(null);
      setUsernameState(null);
      setEmailState(null);
      setIsDeveloperModeState(false);
      setSavedCouponIds([]);
      localStorage.removeItem('promoPulseUser');
      localStorage.removeItem('promoPulseUsername'); // Kept for compatibility, but user obj is primary
      localStorage.removeItem('promoPulseEmail'); // Kept for compatibility
      localStorage.removeItem('promoPulseIsDeveloperMode');
      localStorage.removeItem('promoPulseSavedCouponIds_localUser'); // Clear coupons for a generic local user
    }
  };

  const handleSetUsername = (name: string | null) => {
    setUsernameState(name);
    if (user) {
      const updatedUser = { ...user, displayName: name };
      setUserState(updatedUser);
      localStorage.setItem('promoPulseUser', JSON.stringify(updatedUser));
    }
  };

  const handleSetEmail = (addr: string | null) => {
    setEmailState(addr);
     if (user) {
      const updatedUser = { ...user, email: addr };
      setUserState(updatedUser);
      localStorage.setItem('promoPulseUser', JSON.stringify(updatedUser));
    }
  };

  const handleSetIsDeveloperMode = (isDev: boolean) => {
    setIsDeveloperModeState(isDev);
    localStorage.setItem('promoPulseIsDeveloperMode', JSON.stringify(isDev));
  };

  const performSignOut = async () => {
    handleSetIsAuthenticated(false); // This will clear user data from state and localStorage
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    router.push('/login');
  };

  const handleSetManualMobileModeOverride = (override: ManualMobileModeOverride) => {
    setManualMobileModeOverrideState(override);
    localStorage.setItem('promoPulseManualMobileOverride', override);
  };

  const fetchSavedCouponIdsInternal = (userId: string | null = user?.uid) => {
    if (userId) {
      const storedIds = localStorage.getItem(`promoPulseSavedCouponIds_${userId}`);
      if (storedIds) {
        setSavedCouponIds(JSON.parse(storedIds));
      } else {
        setSavedCouponIds([]);
      }
    } else {
       setSavedCouponIds([]);
    }
  };
  
  const saveCoupon = async (promo: PromoExample) => {
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to save coupons.", variant: "destructive" });
      return;
    }
    try {
      const currentSavedIds = new Set(savedCouponIds);
      if (currentSavedIds.has(promo.id)) {
        toast({ title: "Already Saved", description: `"${promo.title}" is already in My Coupons.` });
        return;
      }
      const newSavedIds = [...Array.from(currentSavedIds), promo.id];
      localStorage.setItem(`promoPulseSavedCouponIds_${user.uid}`, JSON.stringify(newSavedIds));
      // Save full promo object under a separate key if needed by MyCouponsPage directly from localStorage
      const promoDetailsKey = `promoDetails_${user.uid}_${promo.id}`;
      localStorage.setItem(promoDetailsKey, JSON.stringify(promo));

      setSavedCouponIds(newSavedIds);
      toast({ title: "Coupon Saved!", description: `"${promo.title}" has been saved to My Coupons.` });
    } catch (error: any) {
      console.error("Error saving coupon to localStorage: ", error);
      toast({ title: "Save Error", description: error.message || "Could not save coupon.", variant: "destructive" });
    }
  };

  const unsaveCoupon = async (promoId: string) => {
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to manage coupons.", variant: "destructive" });
      return;
    }
    try {
      const newSavedIds = savedCouponIds.filter(id => id !== promoId);
      localStorage.setItem(`promoPulseSavedCouponIds_${user.uid}`, JSON.stringify(newSavedIds));
      
      // Remove promo details from localStorage
      const promoDetailsKey = `promoDetails_${user.uid}_${promoId}`;
      localStorage.removeItem(promoDetailsKey);

      setSavedCouponIds(newSavedIds);
      toast({ title: "Coupon Unsaved", description: "The coupon has been removed from My Coupons." });
    } catch (error: any) {
      console.error("Error unsaving coupon from localStorage: ", error);
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
    fetchSavedCouponIds: () => fetchSavedCouponIdsInternal(), // Expose for manual refresh if needed
  }), [
      mode, dealAlerts, isAuthenticated, user, username, email, isDeveloperMode,
      manualMobileModeOverride, isMobileViewActive, savedCouponIds, toast, router
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
