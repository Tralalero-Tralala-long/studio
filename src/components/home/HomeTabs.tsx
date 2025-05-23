
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
  category?: string;
  game?: string; // New field for specific Roblox game
}

const promoExamples: PromoExample[] = [
  { id: 1, title: "20% Off Your Next Order", code: "SAVE20", platform: "E-commerce", expiry: "2024-12-31", description: "Get 20% off on all items in our store." },
  { id: 2, title: "Free Delivery", code: "FREEDEL", platform: "Delivery", expiry: "2024-11-30", description: "Enjoy free delivery on orders over $25." },
  { id: 3, title: "$10 Referral Bonus", code: "REF10", platform: "Referral", expiry: "N/A", description: "Refer a friend and you both get $10." },
  // Roblox Codes - examples for sub-wallets
  { id: 7, title: "Blox Fruits Gems", code: "BLOXFRUITGEM", platform: "Roblox Codes", expiry: "2025-01-01", description: "Get 100 free gems in Blox Fruits!", category: "game_code", game: "bloxfruits" },
  { id: 8, title: "Anime Champions Coins", code: "ANIMECOIN", platform: "Roblox Codes", expiry: "2025-01-15", description: "Bonus coins for Anime Champions Simulator.", category: "game_code", game: "animechampions" },
  { id: 9, title: "Arm Wrestling Strength", code: "ARMFLEX", platform: "Roblox Codes", expiry: "2024-12-20", description: "Strength boost in Arm Wrestling Simulator.", category: "game_code", game: "armwrestling" },
  { id: 10, title: "Brainrot Evo Points", code: "BRAINBOOST", platform: "Roblox Codes", expiry: "2025-02-01", description: "Evolution points for Brainrot Evolution.", category: "game_code", game: "brainrotevolution" },
  { id: 11, title: "Rivals Arena Cash", code: "RIVALCASH", platform: "Roblox Codes", expiry: "2025-02-10", description: "Get in-game cash for Rivals.", category: "game_code", game: "rivals" },
  { id: 12, title: "Generic Roblox Code", code: "ROBLOXGENERAL", platform: "Roblox Codes", expiry: "2024-12-31", description: "A general promo code for Roblox.", category: "game_code" }, // No specific game
];

const robloxSubWallets = [
  { value: 'bloxfruits', label: 'Blox Fruits' },
  { value: 'animechampions', label: 'Anime Champions Simulator' },
  { value: 'armwrestling', label: 'Arm Wrestling Simulator' },
  { value: 'brainrotevolution', label: 'Brainrot Evolution' },
  { value: 'rivals', label: 'Rivals' },
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
          {robloxSubWallets.map(subWallet => {
            const subWalletPromos = currentPromos.filter(
              p => p.game === subWallet.value
            );
            return (
              <div key={subWallet.value} className="mb-8">
                <h3 className={`text-2xl font-semibold mb-4 ${mode === 'gaming' ? 'font-rajdhani text-accent' : ''}`}>
                  {subWallet.label}
                </h3>
                {subWalletPromos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subWalletPromos.map(promo => (
                      <PromoCard key={promo.id} {...promo} mode={mode} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No promo codes found for {subWallet.label} currently.
                  </p>
                )}
              </div>
            );
          })}
          
          {/* Section for Roblox codes not assigned to a specific sub-wallet */}
          {(() => {
            const generalRobloxPromos = currentPromos.filter(p => !p.game && p.platform === "Roblox Codes");
            if (generalRobloxPromos.length > 0) {
              return (
                <div className="mb-8">
                  <h3 className={`text-2xl font-semibold mb-4 ${mode === 'gaming' ? 'font-rajdhani text-accent' : ''}`}>
                    Other Roblox Codes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {generalRobloxPromos.map(promo => (
                      <PromoCard key={promo.id} {...promo} mode={mode} />
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })()}
          
           {/* Fallback if no promos at all for Roblox Codes */}
           {currentPromos.length === 0 && (
             <p className="col-span-full text-center text-muted-foreground">No Roblox codes found currently. Check back later!</p>
           )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
