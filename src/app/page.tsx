
"use client";

import { useAppContext } from '@/contexts/AppContext';
import HomeTabs from '@/components/home/HomeTabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from 'next/image';

export default function HomePage() {
  const { mode } = useAppContext();

  const heroTitle = mode === 'normal' ? "Find Amazing Deals!" : "Level Up Your Savings!";
  const heroDescription = mode === 'normal' 
    ? "Scan for the latest promo codes from your favorite e-commerce and delivery platforms."
    : "Discover exclusive gaming offers, loot drops, and mystery boxes from Steam, Epic, and Riot.";

  return (
    <div className="w-full">
      <Card className={`mb-8 shadow-xl ${mode === 'gaming' ? 'bg-card text-card-foreground border-primary' : 'bg-card'}`}>
        <CardHeader>
          <CardTitle className={`text-3xl md:text-4xl font-bold ${mode === 'gaming' ? 'font-orbitron text-primary' : 'text-primary'}`}>
            {heroTitle}
          </CardTitle>
          <CardDescription className={`text-lg ${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'}`}>
            {heroDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-4">
          <p className={`flex-1 text-base ${mode === 'gaming' ? 'font-rajdhani' : ''}`}>
            PromoPulse helps you unlock savings effortlessly. Switch between Normal Mode for everyday shopping deals and Gaming Mode for exclusive offers on games and platforms. Enable Deal Alerts to never miss out!
          </p>
          <div className="flex-shrink-0 w-full md:w-1/3 h-48 md:h-64 relative">
            <Image 
              src={mode === 'normal' ? "https://placehold.co/600x400.png" : "https://placehold.co/600x400.png"} 
              alt={mode === 'normal' ? "Shopping bags and discounts" : "Gaming gear and loot boxes"}
              data-ai-hint={mode === 'normal' ? "shopping discount" : "gaming lootbox"}
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-md"
            />
          </div>
        </CardContent>
      </Card>
      
      <HomeTabs />
    </div>
  );
}
