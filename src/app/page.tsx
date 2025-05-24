
"use client";

import { useAppContext } from '@/contexts/AppContext';
import HomeTabs from '@/components/home/HomeTabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from 'next/image';
import { Button, buttonVariants } from '@/components/ui/button'; // Imported buttonVariants
import { Box, Gamepad2, Gift } from 'lucide-react'; // Imported Gift
import { cn } from '@/lib/utils'; // Imported cn

// Data for Special Gaming Features
const gamingFeatures = [
  { 
    title: 'Loot Drops', 
    description: 'Discover daily loot drops and in-game items.', 
    icon: <Box className="w-12 h-12 mx-auto mb-3 text-accent" />, 
    imageUrl: "https://th.bing.com/th/id/OIP.SuNYeiboWqUmRqq8nTyeOwHaFj?rs=1&pid=ImgDetMain", 
    dataAiHint: "treasure chest gold",
    isExternalLink: false,
    href: "#"
  },
  { 
    title: 'Gaming Offers', 
    description: 'Exclusive discounts on games and DLCs.', 
    icon: <Gamepad2 className="w-12 h-12 mx-auto mb-3 text-accent" />, 
    imageUrl: "https://media.wired.com/photos/674769026811d4146e6fa13c/191:100/w_1280,c_limit/cyber-monday-gaming-deals.png", 
    dataAiHint: "gaming deals sale",
    isExternalLink: false,
    href: "#"
  },
  {
    title: 'Game Code Box',
    description: 'Unlock special game codes and bonuses here.',
    icon: <Gift className="w-12 h-12 mx-auto mb-3 text-accent" />,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "gift box code",
    isExternalLink: true,
    href: "https://example.com/gamecodes" // Placeholder URL
  }
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
        
        <HomeTabs />
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
              PromoPulse helps you unlock savings effortlessly. Switch to Normal Mode for everyday shopping deals. Enable Deal Alerts to never miss out! Find codes for Steam, Epic Games Store, Call of Duty, Fortnite, GTA, FIFA, Roblox, and many more.
            </p>
            <div className="flex-shrink-0 w-full md:w-1/3 h-48 md:h-64 relative">
              <Image 
                src="https://dex-bin.bnbstatic.com/static/dapp-uploads/rkBBOwV3vR6x1WykzTYpI"
                alt="Abstract gaming graphic with controller and neon lights for platforms like Steam, Epic Games, Call of Duty, Fortnite, GTA, FIFA"
                data-ai-hint="gaming abstract console"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Changed to md:grid-cols-3 */}
            {gamingFeatures.map(feature => (
              <Card key={feature.title} className="text-center shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-card border-accent">
                <CardHeader>
                  {feature.icon}
                  <CardTitle className="text-xl font-rajdhani text-accent">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-40 sm:h-48 md:h-52 relative mb-4"> {/* Added container for consistent image height */}
                    <Image 
                      src={feature.imageUrl} 
                      alt={feature.title} 
                      data-ai-hint={feature.dataAiHint} 
                      layout="fill" // Use fill
                      objectFit="cover" // Use cover
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
                      Explore
                    </a>
                  ) : (
                    <Button variant="outline" className="w-full button-glow-gaming">
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
