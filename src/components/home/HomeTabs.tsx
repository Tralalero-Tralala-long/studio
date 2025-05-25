
"use client";

import Link from "next/link";
import { useAppContext, type PromoExample } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Truck, Gift, CheckSquare, Heart, CalendarDays, Copy } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { cn, isCodeExpired } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import AddCodeForm from "@/components/AddCodeForm";
import { format } from "date-fns";


export const initialPromoExamples: PromoExample[] = [
  { id: "2", title: "Free Delivery", code: "FREEDEL", platform: "Delivery", expiry: "N/A", description: "Enjoy free delivery on orders over $25.", category: "delivery_discount", isUsed: false },
  { id: "3", title: "$10 Referral Bonus", code: "REF10", platform: "Referral", expiry: "N/A", description: "Refer a friend and you both get $10.", category: "referral_bonus", isUsed: false },
];

interface PromoCardDisplayProps extends PromoExample {
  mode: 'shopping' | 'gaming';
  onToggleUsed: (id: string) => void;
  onSaveToggle: (promo: PromoExample) => void;
  isSaved: boolean;
  isAuthenticated: boolean;
}

function PromoCardDisplay({
  id, title, code, platform, expiry, description, mode, isUsed, onToggleUsed, category, game,
  onSaveToggle, isSaved, isAuthenticated
}: PromoCardDisplayProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied!",
      description: `${code} copied to clipboard.`,
    });
  };

  const handleSaveClick = async () => {
    if (!isAuthenticated) {
      toast({ title: "Login Required", description: "Please log in to save coupons.", variant: "destructive"});
      return;
    }
    setIsSaving(true);
    await onSaveToggle({ id, title, code, platform, expiry, description, category, game, isUsed });
    setIsSaving(false);
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
        <CardDescription className={`${mode === 'gaming' ? 'font-rajdhani' : ''}`}>
          {platform} {game ? `(${game})` : ''}
          {category && <span className="block text-xs">Category: {category}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className={`mb-2 ${mode === 'gaming' ? 'font-rajdhani' : ''}`}>{description}</p>
        <p className={cn(
            "text-sm font-semibold",
            isUsed ? 'line-through' : ''
          )}>Code: <span className={`p-1 rounded ${mode === 'gaming' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>{code}</span></p>
         {expiry && expiry !== "Not specified" && expiry !== "N/A" && (
          <div className={`flex items-center text-xs mt-1 ${mode === 'gaming' ? 'text-muted-foreground/80 font-rajdhani' : 'text-muted-foreground/80'}`}>
            <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
            <span>Expires: {format(new Date(expiry), "MMMM d, yyyy")}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center space-x-2 order-first">
          <Checkbox
            id={`used-${id}-${platform.replace(/\s+/g, '-')}-${game || 'nogame'}`}
            checked={isUsed || false}
            onCheckedChange={() => onToggleUsed(id)}
            aria-labelledby={`label-used-${id}-${platform.replace(/\s+/g, '-')}-${game || 'nogame'}`}
          />
          <Label htmlFor={`used-${id}-${platform.replace(/\s+/g, '-')}-${game || 'nogame'}`} id={`label-used-${id}-${platform.replace(/\s+/g, '-')}-${game || 'nogame'}`} className="text-sm cursor-pointer">
            Mark as Used
          </Label>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto order-last mt-2 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveClick}
            disabled={isSaving || !isAuthenticated}
            className={cn(
              mode === 'gaming' ? 'button-glow-gaming border-accent hover:border-primary' : 'button-glow-normal',
              "flex-1 sm:flex-none"
            )}
            title={isAuthenticated ? (isSaved ? "Unsave Code" : "Save Code") : "Log in to save"}
          >
            <Heart className={cn("mr-2 h-4 w-4", isSaved ? "fill-red-500 text-red-500" : "")} />
            {isSaving ? "..." : (isSaved ? "Saved" : "Save")}
          </Button>
          <Button
            variant={mode === 'gaming' ? 'outline' : 'default'}
            size="sm"
            onClick={handleCopyCode}
            className={`${mode === 'gaming' ? 'button-glow-gaming' : 'button-glow-normal'} font-bold flex-1 sm:flex-none`}
            disabled={isUsed}
          >
            <Copy className="mr-2 h-4 w-4" /> Copy
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function HomeTabs() {
  const { mode, isDeveloperMode, saveCoupon, unsaveCoupon, savedCouponIds, isAuthenticated, user } = useAppContext();
  const { toast } = useToast();

  const [promoExamples, setPromoExamples] = useState<PromoExample[]>(
    initialPromoExamples
      .filter(c => !isCodeExpired(c.expiry))
      .map(p => ({...p, isUsed: p.isUsed || false, id: String(p.id)})) // Ensure ID is string
  );
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  const shoppingTabs = [
    { value: 'ecommerce', label: 'E-commerce', icon: <ShoppingCart className="w-4 h-4 mr-2" /> },
    { value: 'delivery', label: 'Delivery', icon: <Truck className="w-4 h-4 mr-2" /> },
    { value: 'referral', label: 'Referral', icon: <Gift className="w-4 h-4 mr-2" /> },
  ];

  const gamingTabs: { value: string; label: string; icon: JSX.Element }[] = [];

  const tabsToDisplay = useMemo(() => (mode === 'shopping' ? shoppingTabs : gamingTabs), [mode]);

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

  const handleSaveToggle = (promo: PromoExample) => {
    if (savedCouponIds.includes(promo.id)) {
      unsaveCoupon(promo.id);
    } else {
      saveCoupon(promo);
    }
  };

  const getPromosForTab = (tabValue: string | undefined) => {
    if (!tabValue) return [];

    const tabDetails = tabsToDisplay.find(t => t.value.toLowerCase() === tabValue.toLowerCase());
    const platformToFilter = tabDetails ? tabDetails.label : tabValue;

    if (mode === 'shopping') {
      return promoExamples.filter(p =>
        p.platform.toLowerCase() === platformToFilter.toLowerCase() && !isCodeExpired(p.expiry)
      );
    }
    return [];
  };

  if ((mode === 'gaming' && tabsToDisplay.length === 0) || (mode === 'shopping' && tabsToDisplay.length === 0)) {
     return null;
  }

  const currentActiveTabValue = activeTab || (tabsToDisplay.length > 0 ? tabsToDisplay[0].value : undefined);

  return (
    <>
      <Tabs value={currentActiveTabValue} onValueChange={setActiveTab} className="w-full">
        {tabsToDisplay.length > 0 && (
          <TabsList className={`grid w-full grid-cols-${tabsToDisplay.length || 1} mb-6 ${mode === 'gaming' ? 'bg-muted' : 'bg-muted'}`}>
            {tabsToDisplay.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className={`flex items-center justify-center data-[state=active]:${mode === 'gaming' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-primary text-primary-foreground shadow-md'} py-3`}>
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        )}

        {tabsToDisplay.map(tab => {
          const promosForThisTab = getPromosForTab(tab.value);
          return (
            <TabsContent key={tab.value} value={tab.value}>
              {promosForThisTab.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {promosForThisTab.map(promo => (
                    <PromoCardDisplay
                      key={promo.id}
                      {...promo}
                      mode={mode}
                      onToggleUsed={handleToggleUsed}
                      onSaveToggle={handleSaveToggle}
                      isSaved={savedCouponIds.includes(promo.id)}
                      isAuthenticated={isAuthenticated}
                    />
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
    </>
  );
}
