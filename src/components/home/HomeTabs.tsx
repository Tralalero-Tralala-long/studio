
"use client";

import Link from "next/link";
import { useAppContext, type PromoExample } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Truck, Gift, PlusCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { cn } from "@/lib/utils";
import AddCodeForm from '@/components/AddCodeForm'; // Import the new form
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Initial promo examples for normal mode, managed locally in this component
const initialPromoExamples: PromoExample[] = [
  { id: "2", title: "Free Delivery", code: "FREEDEL", platform: "Delivery", expiry: "N/A", description: "Enjoy free delivery on orders over $25.", category: "delivery_discount" },
  { id: "3", title: "$10 Referral Bonus", code: "REF10", platform: "Referral", expiry: "N/A", description: "Refer a friend and you both get $10.", category: "referral_bonus" },
];

function PromoCardDisplay({ title, code, platform, expiry, description, mode }: PromoExample & { mode: 'normal' | 'gaming' }) {
  const { toast } = useToast();
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied!",
      description: `${code} copied to clipboard.`,
    });
  };
  return (
    <Card className={`w-full shadow-lg hover:shadow-xl transition-shadow duration-300 ${mode === 'gaming' ? 'bg-card border-accent text-card-foreground' : ''}`}>
      <CardHeader>
        <CardTitle className={`text-xl ${mode === 'gaming' ? 'text-primary font-orbitron' : 'text-primary'}`}>{title}</CardTitle>
        <CardDescription className={`${mode === 'gaming' ? 'font-rajdhani' : ''}`}>{platform} - Expires: {expiry}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className={`mb-2 ${mode === 'gaming' ? 'font-rajdhani' : ''}`}>{description}</p>
        <p className="text-sm font-semibold">Code: <span className={`p-1 rounded ${mode === 'gaming' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>{code}</span></p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCopyCode}
          variant={mode === 'gaming' ? 'outline' : 'default'} 
          className={`${mode === 'gaming' ? 'button-glow-gaming w-full' : 'button-glow-normal w-full'} font-bold`}
        >
          Copy Code
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function HomeTabs() {
  const { mode, isDeveloperMode } = useAppContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const [promoExamples, setPromoExamples] = useState<PromoExample[]>(initialPromoExamples);
  const [isAddCodeFormOpen, setIsAddCodeFormOpen] = useState(false);
  const [currentPlatformForForm, setCurrentPlatformForForm] = useState<string | undefined>(undefined);


  const normalTabs = [
    { value: 'ecommerce', label: 'E-commerce', icon: <ShoppingCart className="w-4 h-4 mr-2" /> },
    { value: 'delivery', label: 'Delivery', icon: <Truck className="w-4 h-4 mr-2" /> },
    { value: 'referral', label: 'Referral', icon: <Gift className="w-4 h-4 mr-2" /> },
  ];

  const gamingTabs: { value: string; label: string; icon: JSX.Element }[] = [
    // Gaming tabs are intentionally empty here as per previous requirements.
    // If game codes were listed here, developer add button would be needed.
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

  useEffect(() => {
    // This effect can be used to load promoExamples from localStorage if desired for persistence
    // For now, it just uses initialPromoExamples
    setPromoExamples(initialPromoExamples);
  }, []);

  const getPromosForTab = (tabValue: string) => {
    const tabLabel = tabsToDisplay.find(t => t.value === tabValue)?.label.toLowerCase() || tabValue.toLowerCase();
    return promoExamples.filter(p => 
        p.platform.toLowerCase() === tabLabel
    );
  };

  const handleOpenAddCodeForm = (platform: string) => {
    setCurrentPlatformForForm(platform);
    setIsAddCodeFormOpen(true);
  };

  const handleAddCodeSubmit = (formData: { title: string; code: string; expiry?: Date; description: string }) => {
    if (!currentPlatformForForm) return;

    const newPromo: PromoExample = {
      id: Date.now().toString(),
      title: formData.title,
      code: formData.code,
      platform: currentPlatformForForm, // Set by the tab context
      expiry: formData.expiry ? format(formData.expiry, "yyyy-MM-dd") : "Not specified",
      description: formData.description,
      category: mode === 'gaming' ? 'game_code' : `${currentPlatformForForm.toLowerCase().replace(' ', '_')}_discount`,
    };
    setPromoExamples(prevPromos => [...prevPromos, newPromo]);
    setIsAddCodeFormOpen(false);
    toast({
      title: "Code Added!",
      description: `"${newPromo.title}" has been successfully added to ${currentPlatformForForm}.`,
    });
  };
  
  if (tabsToDisplay.length === 0) {
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
              {isDeveloperMode && currentActiveTabValue === tab.value && (
                <div className="flex justify-end mb-4">
                  <Button 
                    variant="outline" 
                    className={cn(mode === 'gaming' ? 'button-glow-gaming' : 'button-glow-normal')}
                    onClick={() => handleOpenAddCodeForm(tab.label)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Code to {tab.label}
                  </Button>
                </div>
              )}
              {promosForThisTab.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {promosForThisTab.map(promo => (
                    <PromoCardDisplay key={promo.id} {...promo} mode={mode} />
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
      {isDeveloperMode && currentPlatformForForm && (
        <AddCodeForm
          isOpen={isAddCodeFormOpen}
          setIsOpen={setIsAddCodeFormOpen}
          onSubmitCode={handleAddCodeSubmit}
          formTitle={`Add Code to ${currentPlatformForForm}`}
        />
      )}
    </>
  );
}
