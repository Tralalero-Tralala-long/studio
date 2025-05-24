
"use client";

import { useAppContext } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Truck, Gift } from 'lucide-react'; // Gift icon for Game Codes
import { useState, useEffect } from 'react'; // Added for controlled tabs

interface PromoExample {
  id: number;
  title: string;
  code: string;
  platform: string;
  expiry: string;
  description: string;
  category?: string;
}

const promoExamples: PromoExample[] = [
  { id: 2, title: "Free Delivery", code: "FREEDEL", platform: "Delivery", expiry: "2024-11-30", description: "Enjoy free delivery on orders over $25." },
  { id: 3, title: "$10 Referral Bonus", code: "REF10", platform: "Referral", expiry: "N/A", description: "Refer a friend and you both get $10." },
  // Roblox Codes - examples (These will not be displayed as the Roblox Codes tab is removed)
  { id: 7, title: "Free Roblox Gems", code: "ROBLOXGEM", platform: "Roblox Codes", expiry: "2025-01-01", description: "Get 100 free gems for your Roblox account!", category: "game_code" },
  { id: 8, title: "Roblox Bonus Coins", code: "ROBLOXCOIN", platform: "Roblox Codes", expiry: "2025-01-15", description: "Bonus coins for your Roblox adventures.", category: "game_code" },
  { id: 9, title: "Exclusive Roblox Item", code: "ROBLOXITEM", platform: "Roblox Codes", expiry: "2024-12-20", description: "Unlock an exclusive item in Roblox.", category: "game_code" },
  { id: 10, title: "Roblox XP Boost", code: "ROBLOOSTXP", platform: "Roblox Codes", expiry: "2025-02-01", description: "Get an XP boost in Roblox.", category: "game_code" },
  { id: 11, title: "Limited Roblox Avatar Outfit", code: "AVATARSTYLE", platform: "Roblox Codes", expiry: "2025-02-10", description: "Get a limited time avatar outfit for Roblox.", category: "game_code" },
  { id: 12, title: "Generic Roblox Code", code: "ROBLOXGENERAL", platform: "Roblox Codes", expiry: "2024-12-31", description: "A general promo code for Roblox.", category: "game_code" },
  // New Game Codes examples
  { id: 13, title: "Special In-Game Item", code: "GAMEITEM456", platform: "Game Codes", expiry: "2025-03-01", description: "Unlock a rare item in your favorite game.", category: "game_code" },
  { id: 14, title: "Bonus Game Currency", code: "COINSGALORE", platform: "Game Codes", expiry: "2025-03-15", description: "Get extra currency for your game account.", category: "game_code" },
  { id: 15, title: "Starter Pack Discount", code: "GAMESTARTER25", platform: "Game Codes", expiry: "2025-04-01", description: "25% off on starter packs for new players.", category: "game_code" },
];

function PromoCard({ title, code, platform, expiry, description, mode }: { title: string, code: string, platform: string, expiry: string, description: string, mode: 'normal' | 'gaming' }) {
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

interface HomeTabsProps {
  initialTab?: string;
}

export default function HomeTabs({ initialTab }: HomeTabsProps) {
  const { mode } = useAppContext();
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  const normalTabs = [
    { value: 'ecommerce', label: 'E-commerce', icon: <ShoppingCart className="w-4 h-4 mr-2" /> },
    { value: 'delivery', label: 'Delivery', icon: <Truck className="w-4 h-4 mr-2" /> },
    { value: 'referral', label: 'Referral', icon: <Gift className="w-4 h-4 mr-2" /> },
  ];

  const gamingTabs = [
    { value: 'game_codes', label: 'Game Codes', icon: <Gift className="w-4 h-4 mr-2" /> },
  ];

  const tabsToDisplay = mode === 'normal' ? normalTabs : gamingTabs;

  useEffect(() => {
    if (initialTab && tabsToDisplay.some(tab => tab.value === initialTab)) {
      setActiveTab(initialTab);
    } else if (tabsToDisplay.length > 0 && !tabsToDisplay.some(tab => tab.value === activeTab)) {
      // If current activeTab is not in tabsToDisplay (e.g. mode changed), set to first tab
      setActiveTab(tabsToDisplay[0].value);
    } else if (tabsToDisplay.length > 0 && !activeTab) {
      // Default to first tab if no active tab is set
       setActiveTab(tabsToDisplay[0].value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTab, mode, tabsToDisplay]); // Re-run if initialTab, mode, or tabsToDisplay changes


  const getPromosForTab = (tabLabel: string) => {
    return promoExamples.filter(p => p.platform.toLowerCase() === tabLabel.toLowerCase().replace('_', ' '));
  };
  
  if (tabsToDisplay.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No promo categories available for this mode currently.
      </div>
    );
  }
  
  // Ensure activeTab has a valid default if it's still undefined
  const currentActiveTab = activeTab || (tabsToDisplay.length > 0 ? tabsToDisplay[0].value : undefined);


  return (
    <Tabs value={currentActiveTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className={`grid w-full grid-cols-${tabsToDisplay.length || 1} mb-6 ${mode === 'gaming' ? 'bg-muted' : 'bg-muted'}`}>
        {tabsToDisplay.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value} className={`flex items-center justify-center data-[state=active]:${mode === 'gaming' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-primary text-primary-foreground shadow-md'} py-3`}>
            {tab.icon} {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabsToDisplay.map(tab => {
        const promosForThisTab = getPromosForTab(tab.label);
        return (
          <TabsContent key={tab.value} value={tab.value}>
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
