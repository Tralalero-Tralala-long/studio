
"use client";

import { useAppContext } from '@/contexts/AppContext';
import HomeTabs from '@/components/home/HomeTabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from 'next/image';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Box, Gamepad2, Gift, ShoppingCart, ExternalLink, Truck, School } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

// Data for Special Gaming Features
const gamingFeatures = [
  {
    title: 'Loot Drops',
    description: 'Discover daily loot drops and in-game items.',
    icon: <Box className="w-12 h-12 mx-auto mb-3 text-accent" />,
    imageUrl: "https://th.bing.com/th/id/OIP.SuNYeiboWqUmRqq8nTyeOwHaFj?rs=1&pid=ImgDetMain",
    dataAiHint: "treasure chest gold",
    isExternalLink: false,
    href: "/loot-drops" // Updated href
  },
  {
    title: 'Gaming Offers',
    description: 'Discounts on games and DLCs.',
    icon: <Gamepad2 className="w-12 h-12 mx-auto mb-3 text-accent" />,
    imageUrl: "https://media.wired.com/photos/674769026811d4146e6fa13c/191:100/w_1280,c_limit/cyber-monday-gaming-deals.png",
    dataAiHint: "gaming deals sale",
    isExternalLink: false,
    href: "/gaming-offers" // Updated href
  },
  {
    title: 'Game Codes',
    description: 'Unlock special game codes and bonuses here.',
    icon: <Gift className="w-12 h-12 mx-auto mb-3 text-accent" />,
    imageUrl: "https://gamblemaniacs.com/admin/assets/images/07/07681a_promo-code.jpg",
    dataAiHint: "promo codes gaming",
    isExternalLink: false, 
    href: "/game-codes" 
  }
];

export default function HomePage() {
  const { mode } = useAppContext();
  const homeTabsRef = useRef<HTMLDivElement>(null);


  const handleGamingFeatureClick = (feature: typeof gamingFeatures[0]) => {
    // This function is now only relevant if href is "#" or not set
    if (feature.isExternalLink && feature.href) { 
      window.open(feature.href, '_blank');
    }
    // Internal navigation is handled by <Link> component directly
  };


  if (mode === 'shopping') {
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
                src="https://img.freepik.com/premium-vector/using-promo-code-online-shopping-checkout_773186-1109.jpg"
                alt="Illustration of online shopping with promo codes"
                data-ai-hint="online shopping promo code"
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-md"
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-1 gap-4">
           <Link
              href="/ecommerce-codes"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                "w-full text-lg py-6 flex items-center justify-center gap-2 button-glow-normal"
              )}
            >
              <ShoppingCart className="mr-2 h-6 w-6" /> 
              <span>E-commerce Codes</span>
            </Link>
            <Link
              href="/delivery-codes"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                "w-full text-lg py-6 flex items-center justify-center gap-2 button-glow-normal"
              )}
            >
              <Truck className="mr-2 h-6 w-6" /> 
              <span>Delivery Codes</span>
            </Link>
            <Link
              href="/education-codes"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                "w-full text-lg py-6 flex items-center justify-center gap-2 button-glow-normal"
              )}
            >
              <School className="mr-2 h-6 w-6" /> 
              <span>Education Codes</span>
            </Link>
        </div>
      </div>
    );
  } else { // mode === 'gaming'
    const heroTitle = "Level Up Your Savings!";
    const heroDescription = "Discover exciting gaming offers, loot drops from major platforms like Steam, Epic Games Store, Call of Duty, Fortnite, GTA, FIFA, plus in-game codes for titles like Roblox, TDS, and more.";
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
              PromoPulse helps you unlock savings effortlessly. Switch to Shopping Mode for everyday shopping deals. Enable Deal Alerts to never miss out! Find codes for Steam, Epic Games Store, Call of Duty, Fortnite, GTA, FIFA, Roblox, and many more.
            </p>
            <div className="flex-shrink-0 w-full md:w-1/3 h-48 md:h-64 relative">
              <Image
                src="https://dex-bin.bnbstatic.com/static/dapp-uploads/rkBBOwV3vR6x1WykzTYpI"
                alt="Abstract gaming graphic with controller and neon lights for platforms like Steam, Epic Games, Call of Duty, Fortnite, GTA, FIFA"
                data-ai-hint="gaming console"
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-md"
              />
            </div>
          </CardContent>
        </Card>

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
                  <div className="w-full h-40 sm:h-48 md:h-52 relative mb-4">
                    <Image
                      src={feature.imageUrl}
                      alt={feature.title}
                      data-ai-hint={feature.dataAiHint}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
                <CardFooter>
                  {feature.isExternalLink ? (
                    <a
                      href={feature.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: 'outline' }), "w-full button-glow-gaming")}
                    >
                      Explore <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  ) : feature.href && feature.href !== "#" ? (
                    <Link
                      href={feature.href}
                      className={cn(buttonVariants({ variant: 'outline' }), "w-full button-glow-gaming")}
                    >
                      Explore
                    </Link>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full button-glow-gaming"
                      onClick={() => handleGamingFeatureClick(feature)} 
                    >
                      Explore
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
