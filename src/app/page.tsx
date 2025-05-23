
"use client";

import { useAppContext } from '@/contexts/AppContext';
import HomeTabs from '@/components/home/HomeTabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Search, Box, Gamepad2, PackageIcon } from 'lucide-react';

// Data for Special Gaming Features, moved from HomeTabs
const gamingFeatures = [
  { title: 'Loot Drops', description: 'Discover daily loot drops and in-game items.', icon: <Box className="w-12 h-12 mx-auto mb-3 text-accent" />, dataAiHint: "gaming loot" },
  { title: 'Gaming Offers', description: 'Exclusive discounts on games and DLCs.', icon: <Gamepad2 className="w-12 h-12 mx-auto mb-3 text-accent" />, dataAiHint: "controller sale" },
  { title: 'Mystery Boxes', description: 'Unlock mystery boxes for surprising rewards.', icon: <PackageIcon className="w-12 h-12 mx-auto mb-3 text-accent" />, dataAiHint: "mystery gift" },
];

export default function HomePage() {
  const { mode } = useAppContext();

  if (mode === 'normal') {
    const heroTitle = "Find Amazing Deals!";
    const heroDescription = "Scan for the latest promo codes from your favorite e-commerce and delivery platforms.";
    return (
      <div className="w-full space-y-8">
        <Card className="shadow-xl bg-card">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary">
              {heroTitle}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {heroDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-4">
            <p className="flex-1 text-base">
              PromoPulse helps you unlock savings effortlessly. Switch to Gaming Mode for exciting offers on games and platforms. Enable Deal Alerts to never miss out!
            </p>
            <div className="flex-shrink-0 w-full md:w-1/3 h-48 md:h-64 relative">
              <Image 
                src="https://placehold.co/600x400.png"
                alt="Shopping bags and discounts"
                data-ai-hint="shopping discount"
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-md"
              />
            </div>
          </CardContent>
        </Card>
        
        <HomeTabs />

        <div className="mt-8 text-center">
          <Button size="lg" className="button-glow-normal bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 font-bold">
            <Search className="w-5 h-5 mr-2" /> Scan All Codes
          </Button>
        </div>
      </div>
    );
  } else { // mode === 'gaming'
    const heroTitle = "Level Up Your Savings!";
    const heroDescription = "Discover exciting gaming offers, loot drops, mystery boxes from major platforms, and in-game codes for titles like Roblox, TDS, and more.";
    return (
      <div className="w-full space-y-8">
        <Card className="shadow-xl bg-card text-card-foreground border-primary">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-bold font-orbitron text-primary">
              {heroTitle}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground font-rajdhani">
              {heroDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-4">
            <p className="flex-1 text-base font-rajdhani">
              PromoPulse helps you unlock savings effortlessly. Switch to Normal Mode for everyday shopping deals. Enable Deal Alerts to never miss out!
            </p>
            <div className="flex-shrink-0 w-full md:w-1/3 h-48 md:h-64 relative">
              <Image 
                src="https://placehold.co/600x400.png"
                alt="Gaming gear, codes, and loot boxes"
                data-ai-hint="gaming codes lootbox"
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-md"
              />
            </div>
          </CardContent>
        </Card>
        
        <HomeTabs />

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center font-orbitron text-primary">
            Special Gaming Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gamingFeatures.map(feature => (
              <Card key={feature.title} className="text-center shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-card border-accent">
                <CardHeader>
                  {feature.icon}
                  <CardTitle className="text-xl font-rajdhani text-accent">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Image src={`https://placehold.co/300x200.png`} alt={feature.title} data-ai-hint={feature.dataAiHint} width={300} height={200} className="rounded-md mb-4 aspect-video object-cover" />
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full button-glow-gaming">Explore</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
