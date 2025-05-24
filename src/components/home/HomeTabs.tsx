
"use client";

import Link from "next/link";
import { useAppContext, type PromoExample } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Truck, Gift, CheckSquare, Square, Code } from 'lucide-react'; 
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
  mode: 'shopping' | 'gaming'; // Updated mode type
  onToggleUsed: (id: string) => void;
}

function PromoCardDisplay({ id, title, code, platform, expiry, description, mode, isUsed, onToggleUsed, category, game }: PromoCardDisplayProps) {
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
        <CardDescription className={`${mode === 'gaming' ? 'font-rajdhani' : ''}`}>
          {platform} {game ? `(${game})` : ''} - Expires: {expiry}
          {category && <span className="block text-xs">Category: {category}</span>}
        </CardDescription>
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
            id={`used-${id}-${platform.replace(/\s+/g, '-')}-${game || 'nogame'}`}
            checked={isUsed || false}
            onCheckedChange={() => onToggleUsed(id)}
            aria-labelledby={`label-used-${id}-${platform.replace(/\s+/g, '-')}-${game || 'nogame'}`}
          />
          <Label htmlFor={`used-${id}-${platform.replace(/\s+/g, '-')}-${game || 'nogame'}`} id={`label-used-${id}-${platform.replace(/\s+/g, '-')}-${game || 'nogame'}`} className="text-sm cursor-pointer">
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
  const { mode, isDeveloperMode } = useAppContext(); 
  const { toast } = useToast();
  
  const [promoExamples, setPromoExamples] = useState<PromoExample[]>(
    initialPromoExamples
      .filter(c => !isCodeExpired(c.expiry))
      .map(p => ({...p, isUsed: p.isUsed || false}))
  );
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  
  // State for AddCodeForm dialog (for shopping mode tabs)
  const [isAddCodeFormOpen, setIsAddCodeFormOpen] = useState(false);
  const [currentPlatformForForm, setCurrentPlatformForForm] = useState<string | undefined>(undefined);


  const shoppingTabs = [ // Renamed from normalTabs
    { value: 'ecommerce', label: 'E-commerce', icon: <ShoppingCart className="w-4 h-4 mr-2" /> },
    { value: 'delivery', label: 'Delivery', icon: <Truck className="w-4 h-4 mr-2" /> },
    { value: 'referral', label: 'Referral', icon: <Gift className="w-4 h-4 mr-2" /> },
  ];

  const gamingTabs: { value: string; label: string; icon: JSX.Element }[] = []; // Empty for now

  const tabsToDisplay = useMemo(() => (mode === 'shopping' ? shoppingTabs : gamingTabs), [mode]); // Updated logic

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
  
  const handleAddCodeSubmitForShoppingTabs = (formData: { title: string; code: string; expiry?: Date; description: string; category?: string }) => {
    if (!currentPlatformForForm) {
        toast({ title: "Error", description: "Platform not specified for new code.", variant: "destructive" });
        return;
    }
    const newPromo: PromoExample = {
      id: Date.now().toString(),
      title: formData.title,
      code: formData.code,
      platform: currentPlatformForForm, // Set platform based on current tab
      expiry: formData.expiry ? format(formData.expiry, "yyyy-MM-dd") : "Not specified",
      description: formData.description,
      category: formData.category || currentPlatformForForm.toLowerCase(), // Default category to platform name if not provided
      isUsed: false,
    };
    
    if (isCodeExpired(newPromo.expiry)) {
      toast({
        title: "Expired Code",
        description: "This code is already expired and will not be added.",
        variant: "destructive",
      });
      setIsAddCodeFormOpen(false);
      return;
    }

    setPromoExamples(prevCodes => [newPromo, ...prevCodes]);
    setIsAddCodeFormOpen(false);
    toast({
      title: "Code Added!",
      description: `"${newPromo.title}" has been successfully added to ${currentPlatformForForm}.`,
    });
  };

  const handleOpenAddCodeForm = (platform: string) => {
    setCurrentPlatformForForm(platform);
    setIsAddCodeFormOpen(true);
  };


  const getPromosForTab = (tabValue: string | undefined) => {
    if (!tabValue) return [];
    
    const tabDetails = tabsToDisplay.find(t => t.value.toLowerCase() === tabValue.toLowerCase());
    const platformToFilter = tabDetails ? tabDetails.label : tabValue; 
  
    if (mode === 'shopping') { // Updated logic
      return promoExamples.filter(p => 
        p.platform.toLowerCase() === platformToFilter.toLowerCase() && !isCodeExpired(p.expiry)
      );
    }
    return []; 
  };
  
  if ((mode === 'gaming' && tabsToDisplay.length === 0) || (mode === 'shopping' && tabsToDisplay.length === 0)) { // Updated logic
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
              {isDeveloperMode && mode === 'shopping' && (
                <div className="flex justify-end mb-4">
                  <Button onClick={() => handleOpenAddCodeForm(tab.label)}>Add Code to {tab.label}</Button>
                </div>
              )}
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
      {isDeveloperMode && mode === 'shopping' && (
        <AddCodeForm
          isOpen={isAddCodeFormOpen}
          setIsOpen={setIsAddCodeFormOpen}
          onSubmitCode={handleAddCodeSubmitForShoppingTabs}
          formTitle={`Add New ${currentPlatformForForm || ''} Code`}
        />
      )}
    </>
  );
}
