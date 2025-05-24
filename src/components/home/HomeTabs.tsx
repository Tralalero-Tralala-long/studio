
"use client";

import Link from "next/link";
import { useAppContext, type PromoExample } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Truck, Gift, PlusCircle, CheckSquare, Square, Code } from 'lucide-react'; // Keep Code for gaming mode if it was there
import { useState, useEffect, useMemo } from 'react';
import { cn, isCodeExpired } from "@/lib/utils";
// AddCodeForm import is removed as it's no longer used directly in this component for normal mode tabs
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";


const initialPromoExamples: PromoExample[] = [
  // { id: "1", title: "20% Off Next Order", code: "SAVE20", platform: "E-commerce", expiry: "2024-12-31", description: "Get 20% off your next order on selected items.", category: "ecommerce_discount", isUsed: false },
  { id: "2", title: "Free Delivery", code: "FREEDEL", platform: "Delivery", expiry: "N/A", description: "Enjoy free delivery on orders over $25.", category: "delivery_discount", isUsed: false },
  { id: "3", title: "$10 Referral Bonus", code: "REF10", platform: "Referral", expiry: "N/A", description: "Refer a friend and you both get $10.", category: "referral_bonus", isUsed: false },
  // Example Roblox code, platform will be 'Game Codes' or similar if gaming tabs are present
  // { id: "7", title: "Roblox TDS Gems", code: "GEMSRFUN", platform: "Game Codes", game: "Tower Defense Simulator", expiry: "N/A", description: "Get 500 Gems in Tower Defense Simulator.", category: "game_code", isUsed: false },
];

interface PromoCardDisplayProps extends PromoExample {
  mode: 'normal' | 'gaming';
  onToggleUsed: (id: string) => void;
}

function PromoCardDisplay({ id, title, code, platform, expiry, description, mode, isUsed, onToggleUsed }: PromoCardDisplayProps) {
  const { toast } = useToast();
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied!",
      description: `${code} copied to clipboard.`,
    });
  };
  return (
    <Card className={cn(
        `w-full shadow-lg hover:shadow-xl transition-shadow duration-300`,
        mode === 'gaming' ? 'bg-card border-accent text-card-foreground' : '',
        isUsed ? 'opacity-60' : ''
      )}>
      <CardHeader>
        <CardTitle className={cn(
            `text-xl`,
            mode === 'gaming' ? 'text-primary font-orbitron' : 'text-primary',
            isUsed ? 'line-through' : ''
          )}>{title}</CardTitle>
        <CardDescription className={`${mode === 'gaming' ? 'font-rajdhani' : ''}`}>{platform} - Expires: {expiry}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className={`mb-2 ${mode === 'gaming' ? 'font-rajdhani' : ''}`}>{description}</p>
        <p className={cn(
            "text-sm font-semibold",
            isUsed ? 'line-through' : ''
          )}>Code: <span className={`p-1 rounded ${mode === 'gaming' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>{code}</span></p>
      </CardContent>
      <CardFooter className="flex-col items-start space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`used-${id}-${platform.replace(/\s+/g, '-')}`}
            checked={isUsed || false}
            onCheckedChange={() => onToggleUsed(id)}
            aria-labelledby={`label-used-${id}-${platform.replace(/\s+/g, '-')}`}
          />
          <Label htmlFor={`used-${id}-${platform.replace(/\s+/g, '-')}`} id={`label-used-${id}-${platform.replace(/\s+/g, '-')}`} className="text-sm cursor-pointer">
            Mark as Used
          </Label>
        </div>
        <Button 
          onClick={handleCopyCode}
          variant={mode === 'gaming' ? 'outline' : 'default'} 
          className={`${mode === 'gaming' ? 'button-glow-gaming w-full' : 'button-glow-normal w-full'} font-bold`}
          disabled={isUsed}
        >
          Copy Code
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function HomeTabs() {
  const { mode, isDeveloperMode } = useAppContext(); // isDeveloperMode can still be used for other purposes if needed
  
  const [promoExamples, setPromoExamples] = useState<PromoExample[]>(
    initialPromoExamples
      .filter(p => !isCodeExpired(p.expiry))
      .map(p => ({...p, isUsed: p.isUsed || false}))
  );
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);


  const normalTabs = [
    { value: 'ecommerce', label: 'E-commerce', icon: <ShoppingCart className="w-4 h-4 mr-2" /> },
    { value: 'delivery', label: 'Delivery', icon: <Truck className="w-4 h-4 mr-2" /> },
    { value: 'referral', label: 'Referral', icon: <Gift className="w-4 h-4 mr-2" /> },
  ];

  // Gaming tabs are intentionally empty or managed as per other requirements
  const gamingTabs: { value: string; label: string; icon: JSX.Element }[] = [
    // { value: 'game_codes', label: 'Roblox Codes', icon: <Code className="w-4 h-4 mr-2" /> },
  ];

  const tabsToDisplay = useMemo(() => (mode === 'normal' ? normalTabs : gamingTabs), [mode]);

  useEffect(() => {
    if (tabsToDisplay.length > 0) {
      if (!tabsToDisplay.some(tab => tab.value === activeTab) || !activeTab) {
        setActiveTab(tabsToDisplay[0].value);
      }
    } else {
      setActiveTab(undefined);
    }
  }, [mode, tabsToDisplay, activeTab]);


  const handleToggleUsed = (id: string) => {
    setPromoExamples(prevPromos =>
      prevPromos.map(promo =>
        promo.id === id ? { ...promo, isUsed: !promo.isUsed } : promo
      )
    );
  };

  const getPromosForTab = (tabValue: string | undefined) => {
    if (!tabValue) return [];
    
    const tabDetails = tabsToDisplay.find(t => t.value.toLowerCase() === tabValue.toLowerCase());
    // Fallback to tabValue if tabDetails is not found, for more robust matching against platform
    const platformToFilter = tabDetails ? tabDetails.label : tabValue; 
  
    if (mode === 'normal') {
      return promoExamples.filter(p => 
        p.platform.toLowerCase() === platformToFilter.toLowerCase() && !isCodeExpired(p.expiry)
      );
    }
    // For gaming mode, if it were to have its own local codes handled here:
    // else if (mode === 'gaming') {
    //   return promoExamples.filter(p => 
    //     p.category === 'game_code' && p.platform.toLowerCase() === platformToFilter.toLowerCase() && !isCodeExpired(p.expiry)
    //   );
    // }
    return []; // Default to empty if mode isn't handled or no specific filtering logic is present
  };
  
  if (mode === 'gaming' && tabsToDisplay.length === 0) {
     return null; 
  }
  if (mode === 'normal' && tabsToDisplay.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No promo categories available for this mode currently.
      </div>
    );
  }
  
  const currentActiveTabValue = activeTab || (tabsToDisplay.length > 0 ? tabsToDisplay[0].value : undefined);

  return (
    <>
      <Tabs value={currentActiveTabValue} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full grid-cols-${tabsToDisplay.length || 1} mb-6 ${mode === 'gaming' ? 'bg-muted' : 'bg-muted'}`}>
          {tabsToDisplay.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className={`flex items-center justify-center data-[state=active]:${mode === 'gaming' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-primary text-primary-foreground shadow-md'} py-3`}>
              {tab.icon} {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabsToDisplay.map(tab => {
          const promosForThisTab = getPromosForTab(tab.value);
          return (
            <TabsContent key={tab.value} value={tab.value}>
              {/* "Add Code" button for normal mode developer is removed from here */}
              {promosForThisTab.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {promosForThisTab.map(promo => (
                    <PromoCardDisplay key={promo.id} {...promo} mode={mode} onToggleUsed={handleToggleUsed} />
                  ))}
                </div>
              ) : (
                <p className="col-span-full text-center text-muted-foreground py-6">
                  No {tab.label} promos found currently. Check back later!
                </p>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
      {/* The AddCodeForm dialog instance for normal mode developer is removed from here */}
    </>
  );
}

