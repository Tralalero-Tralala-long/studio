
"use client";

import { useAppContext } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Truck, Gift, Code } from 'lucide-react';

interface PromoExample {
  id: number;
  title: string;
  code: string;
  platform: string;
  expiry: string;
  description: string;
  category?: string; // Kept for potential future use, but not driving sub-wallets anymore
}

const promoExamples: PromoExample[] = [
  { id: 1, title: "20% Off Your Next Order", code: "SAVE20", platform: "E-commerce", expiry: "2024-12-31", description: "Get 20% off on all items in our store." },
  { id: 2, title: "Free Delivery", code: "FREEDEL", platform: "Delivery", expiry: "2024-11-30", description: "Enjoy free delivery on orders over $25." },
  { id: 3, title: "$10 Referral Bonus", code: "REF10", platform: "Referral", expiry: "N/A", description: "Refer a friend and you both get $10." },
  // Roblox Codes - examples
  { id: 7, title: "Free Roblox Gems", code: "ROBLOXGEM", platform: "Roblox Codes", expiry: "2025-01-01", description: "Get 100 free gems for your Roblox account!", category: "game_code" },
  { id: 8, title: "Roblox Bonus Coins", code: "ROBLOXCOIN", platform: "Roblox Codes", expiry: "2025-01-15", description: "Bonus coins for your Roblox adventures.", category: "game_code" },
  { id: 9, title: "Exclusive Roblox Item", code: "ROBLOXITEM", platform: "Roblox Codes", expiry: "2024-12-20", description: "Unlock an exclusive item in Roblox.", category: "game_code" },
  { id: 10, title: "Roblox XP Boost", code: "ROBLOOSTXP", platform: "Roblox Codes", expiry: "2025-02-01", description: "Get an XP boost in Roblox.", category: "game_code" },
  { id: 11, title: "Limited Roblox Avatar Outfit", code: "AVATARSTYLE", platform: "Roblox Codes", expiry: "2025-02-10", description: "Get a limited time avatar outfit for Roblox.", category: "game_code" },
  { id: 12, title: "Generic Roblox Code", code: "ROBLOXGENERAL", platform: "Roblox Codes", expiry: "2024-12-31", description: "A general promo code for Roblox.", category: "game_code" },
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

export default function HomeTabs() {
  const { mode } = useAppContext();

  const normalTabs = [
    { value: 'ecommerce', label: 'E-commerce', icon: <ShoppingCart className="w-4 h-4 mr-2" /> },
    { value: 'delivery', label: 'Delivery', icon: <Truck className="w-4 h-4 mr-2" /> },
    { value: 'referral', label: 'Referral', icon: <Gift className="w-4 h-4 mr-2" /> },
  ];

  const gamingTabs = [
    { value: 'roblox', label: 'Roblox Codes', icon: <Code className="w-4 h-4 mr-2" /> },
  ];

  const tabs = mode === 'normal' ? normalTabs : gamingTabs;
  
  const currentPromos = mode === 'normal' 
    ? promoExamples.filter(p => ['E-commerce', 'Delivery', 'Referral'].includes(p.platform))
    : promoExamples.filter(p => p.platform === "Roblox Codes");

  return (
    <Tabs defaultValue={tabs[0].value} className="w-full">
      <TabsList className={`grid w-full grid-cols-${tabs.length} mb-6 ${mode === 'gaming' ? 'bg-muted' : 'bg-muted'}`}>
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value} className={`flex items-center justify-center data-[state=active]:${mode === 'gaming' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-primary text-primary-foreground shadow-md'} py-3`}>
            {tab.icon} {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {mode === 'normal' && normalTabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPromos.filter(p => p.platform.toLowerCase().includes(tab.label.toLowerCase().replace(/\s+/g, '').replace('-', ''))).map(promo => (
              <PromoCard key={promo.id} {...promo} mode={mode} />
            ))}
            {currentPromos.filter(p => p.platform.toLowerCase().includes(tab.label.toLowerCase().replace(/\s+/g, '').replace('-', ''))).length === 0 && (
              <p className="col-span-full text-center text-muted-foreground">No {tab.label} promos found currently. Check back later!</p>
            )}
          </div>
        </TabsContent>
      ))}

      {mode === 'gaming' && gamingTabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value}>
           {currentPromos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPromos.map(promo => ( // Directly map all currentPromos (which are already filtered for "Roblox Codes")
                <PromoCard key={promo.id} {...promo} mode={mode} />
              ))}
            </div>
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              No {tab.label} found currently. Check back later!
            </p>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}

