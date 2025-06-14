
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Gift, ArrowLeft, Gamepad2, ShoppingCart, Truck, School, Code } from "lucide-react"; 
import Link from 'next/link';
import Image from 'next/image';
import { cn } from "@/lib/utils";

export default function GameCodesPage() { 
  const { mode } = useAppContext();
  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-center">
      <Image
        src="https://preview.redd.it/all-162-games-i-played-and-completed-only-singleplayer-v0-2xqy5aadytka1.jpg?width=1280&crop=smart&auto=webp&s=17d2c8a43bb5adcb11f3ace8c6b8f29e2c425d03"
        alt="Gaming collage background"
        data-ai-hint="gaming collage games"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 -z-20 opacity-80"
        priority 
      />
      <div className="absolute inset-0 bg-black/60 -z-10"></div>
      
      <Card className={`w-full max-w-2xl ${mode === 'gaming' ? 'bg-card/70 border-primary backdrop-blur-md' : 'bg-card/80 backdrop-blur-md'} shadow-xl my-8`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className={`w-8 h-8 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
              <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron text-primary-foreground' : 'text-primary'}`}>
                Code Categories
              </CardTitle>
            </div>
            <Link href="/" passHref>
              <Button 
                variant="outline" 
                className={cn(
                  mode === 'gaming' ? 'button-glow-gaming hover:border-accent text-primary-foreground' : 'button-glow-normal hover:border-primary'
                )}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className={`text-lg ${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'}`}>
            Discover and manage your codes here. Select a category below.
          </p>

          <div className="my-6">
            <Image 
              src="https://gamblemaniacs.com/admin/assets/images/07/07681a_promo-code.jpg"
              alt="Game promo codes concept"
              data-ai-hint="promo codes gaming"
              width={600}
              height={400}
              className="rounded-lg shadow-md mx-auto"
              style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
            />
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-4">
            <Link
              href="/roblox-codes"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                "w-full text-lg py-6 flex items-center justify-center gap-2",
                mode === 'gaming' ? 'button-glow-gaming border-accent hover:border-primary text-primary-foreground' : 'button-glow-normal'
              )}
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M12.22 18.04L5.99 21.41l1.22-7.06-5.22-4.73 7.2-.62L12 2.61l3.01 6.39 7.2.62-5.22 4.73 1.22 7.06-6.23-3.37Z"/><path d="M12.22 18.04L12 12l.22 6.04z"/>
                <path d="M12 12l6.23 3.37-1.22-7.06 5.22-4.73-7.2-.62L12 2.61V12z"/>
              </svg> 
              <span>Roblox Game Codes</span>
            </Link>

            <Link
              href="/call-of-duty-codes"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                "w-full text-lg py-6 flex items-center justify-center gap-2",
                mode === 'gaming' ? 'button-glow-gaming border-accent hover:border-primary text-primary-foreground' : 'button-glow-normal'
              )}
            >
              <Gamepad2 className="mr-2 h-6 w-6" /> 
              <span>Call of Duty Codes</span>
            </Link>

            <Link
              href="/free-fire-codes"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                "w-full text-lg py-6 flex items-center justify-center gap-2",
                mode === 'gaming' ? 'button-glow-gaming border-accent hover:border-primary text-primary-foreground' : 'button-glow-normal'
              )}
            >
              <Gamepad2 className="mr-2 h-6 w-6" />
              <span>Free Fire (Garena) Codes</span>
            </Link>
          </div>

          <div className="mt-8 p-6 border border-dashed rounded-lg text-center text-muted-foreground">
            Additional game categories will be listed here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
