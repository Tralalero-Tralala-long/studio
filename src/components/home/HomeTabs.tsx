
"use client";

import Link from "next/link";
import { useAppContext, type PromoExample } from '@/contexts/AppContext'; // Import PromoExample from AppContext
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { ShoppingCart, Truck, Gift, Code, PlusCircle } from 'lucide-react'; // Added Code, PlusCircle
import { useState, useEffect, useMemo } from 'react';
import { cn } from "@/lib/utils";

function PromoCard({ title, code, platform, expiry, description, mode }: PromoExample & { mode: 'normal' | 'gaming' }) {
  return (
    <Card className={`w-full shadow-lg hover:shadow-xl transition-shadow duration-300 ${mode === 'gaming' ? 'bg-card border-accent text-card-foreground' : ''}`}>
      <CardHeader>
        <CardTitle className={`text-xl ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`}>{title}</CardTitle>
        <CardDescription>{platform} - Expires: {expiry}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-2">{description}</p>
        <p className="text-sm font-semibold">Code: <span className={`p-1 rounded ${mode === 'gaming' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>{code}</span></p>
      </CardContent>
      <CardFooter>
        <Button variant={mode === 'gaming' ? 'outline' : 'default'} className={`${mode === 'gaming' ? 'button-glow-gaming w-full' : 'button-glow-normal w-full'} font-bold`}>
          Copy Code & Visit
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function HomeTabs() {
  const { mode, promoExamples, isDeveloperMode } = useAppContext(); // Get promoExamples and isDeveloperMode from context
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  const normalTabs = [
    { value: 'ecommerce', label: 'E-commerce', icon: <ShoppingCart className="w-4 h-4 mr-2" /> },
    { value: 'delivery', label: 'Delivery', icon: <Truck className="w-4 h-4 mr-2" /> },
    { value: 'referral', label: 'Referral', icon: <Gift className="w-4 h-4 mr-2" /> },
  ];

  const gamingTabs: { value: string; label: string; icon: JSX.Element }[] = [
     // Keeping gamingTabs empty as per previous request, will be managed by other components or pages.
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


  const getPromosForTab = (tabValue: string) => {
    const tabLabel = tabsToDisplay.find(t => t.value === tabValue)?.label || tabValue;
    return promoExamples.filter(p => 
        p.platform.toLowerCase() === tabLabel.toLowerCase() || 
        (p.game && p.game.toLowerCase() === tabLabel.toLowerCase())
    );
  };
  
  if (tabsToDisplay.length === 0 && mode === 'gaming') {
    return (
      <div className="text-center text-muted-foreground py-8">
        {isDeveloperMode && (
          <Link href={`/add-code?mode=${mode}&platform=Game%20Codes`} passHref>
             <Button variant="outline" className={cn(mode === 'gaming' ? 'button-glow-gaming mb-4' : 'button-glow-normal mb-4')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Game Code
            </Button>
          </Link>
        )}
        <p>No specific game promo categories are active here. Check individual game pages or features.</p>
      </div>
    );
  }
  if (tabsToDisplay.length === 0) {
     return (
      <div className="text-center text-muted-foreground py-8">
        No promo categories available for this mode currently.
      </div>
    );
  }
  
  const currentActiveTabValue = activeTab || (tabsToDisplay.length > 0 ? tabsToDisplay[0].value : undefined);

  return (
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
            {isDeveloperMode && currentActiveTabValue === tab.value && (
              <div className="flex justify-end mb-4">
                <Link href={`/add-code?platform=${encodeURIComponent(tab.label)}&mode=${mode}`} passHref>
                  <Button variant="outline" className={cn(mode === 'gaming' ? 'button-glow-gaming' : 'button-glow-normal')}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Code to {tab.label}
                  </Button>
                </Link>
              </div>
            )}
            {promosForThisTab.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promosForThisTab.map(promo => (
                  <PromoCard key={promo.id} {...promo} mode={mode} />
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
  );
}
