
"use client";

import { useAppContext } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Truck, Gift, Gamepad2, Puzzle, Shield, Search, Box, PackageIcon } from 'lucide-react'; // PackageIcon for mystery box
import Image from 'next/image';

const promoExamples = [
  { id: 1, title: "20% Off Your Next Order", code: "SAVE20", platform: "E-commerce", expiry: "2024-12-31", description: "Get 20% off on all items in our store." },
  { id: 2, title: "Free Delivery", code: "FREEDEL", platform: "Delivery", expiry: "2024-11-30", description: "Enjoy free delivery on orders over $25." },
  { id: 3, title: "$10 Referral Bonus", code: "REF10", platform: "Referral", expiry: "N/A", description: "Refer a friend and you both get $10." },
  { id: 4, title: "Steam Wallet Top-Up", code: "STEAMUP5", platform: "Steam", expiry: "2024-12-15", description: "$5 bonus on $50 Steam wallet top-up." },
  { id: 5, title: "Free Epic Game", code: "EPICFREEBIE", platform: "Epic", expiry: "2024-11-20", description: "Claim a free game this week on Epic Games Store." },
  { id: 6, title: "Riot Points Bonus", code: "RIOTPOINTS", platform: "Riot", expiry: "2024-12-01", description: "Get 10% extra Riot Points on your next purchase." },
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
        <Button variant={mode === 'gaming' ? 'outline' : 'default'} className={mode === 'gaming' ? 'button-glow-gaming w-full' : 'button-glow-normal w-full'}>
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
    { value: 'steam', label: 'Steam', icon: <Gamepad2 className="w-4 h-4 mr-2" /> },
    { value: 'epic', label: 'Epic', icon: <Puzzle className="w-4 h-4 mr-2" /> },
    { value: 'riot', label: 'Riot', icon: <Shield className="w-4 h-4 mr-2" /> },
  ];

  const tabs = mode === 'normal' ? normalTabs : gamingTabs;
  const currentPromos = mode === 'normal' 
    ? promoExamples.filter(p => ['E-commerce', 'Delivery', 'Referral'].includes(p.platform))
    : promoExamples.filter(p => ['Steam', 'Epic', 'Riot'].includes(p.platform));

  return (
    <Tabs defaultValue={tabs[0].value} className="w-full">
      <TabsList className={`grid w-full grid-cols-${tabs.length} mb-6 ${mode === 'gaming' ? 'bg-muted' : 'bg-muted'}`}>
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value} className={`flex items-center justify-center data-[state=active]:${mode === 'gaming' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-primary text-primary-foreground shadow-md'} py-3`}>
            {tab.icon} {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPromos.filter(p => p.platform.toLowerCase().includes(tab.label.toLowerCase())).map(promo => (
              <PromoCard key={promo.id} {...promo} mode={mode} />
            ))}
            {currentPromos.filter(p => p.platform.toLowerCase().includes(tab.label.toLowerCase())).length === 0 && (
              <p className="col-span-full text-center text-muted-foreground">No {tab.label} promos found currently. Check back later!</p>
            )}
          </div>
        </TabsContent>
      ))}

      {mode === 'normal' && (
        <div className="mt-8 text-center">
          <Button size="lg" className="button-glow-normal bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
            <Search className="w-5 h-5 mr-2" /> Scan All Codes
          </Button>
        </div>
      )}

      {mode === 'gaming' && (
        <div className="mt-10">
          <h2 className={`text-2xl font-bold mb-6 text-center ${mode === 'gaming' ? 'font-orbitron text-primary' : 'text-primary'}`}>Special Gaming Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Loot Drops', description: 'Discover daily loot drops and in-game items.', icon: <Box className="w-12 h-12 mx-auto mb-3 text-accent" />, dataAiHint: "gaming loot" },
              { title: 'Gaming Offers', description: 'Exclusive discounts on games and DLCs.', icon: <Gamepad2 className="w-12 h-12 mx-auto mb-3 text-accent" />, dataAiHint: "controller sale" },
              { title: 'Mystery Boxes', description: 'Unlock mystery boxes for surprising rewards.', icon: <PackageIcon className="w-12 h-12 mx-auto mb-3 text-accent" />, dataAiHint: "mystery gift" },
            ].map(feature => (
              <Card key={feature.title} className={`text-center shadow-lg hover:shadow-2xl transition-shadow duration-300 ${mode === 'gaming' ? 'bg-card border-accent' : ''}`}>
                <CardHeader>
                  {feature.icon}
                  <CardTitle className={`text-xl ${mode === 'gaming' ? 'font-rajdhani text-accent' : ''}`}>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Image src={`https://placehold.co/300x200.png`} alt={feature.title} data-ai-hint={feature.dataAiHint} width={300} height={200} className="rounded-md mb-4 aspect-video object-cover" />
                  <p className={`${mode === 'gaming' ? 'text-muted-foreground' : ''}`}>{feature.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full button-glow-gaming">Explore</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Tabs>
  );
}

