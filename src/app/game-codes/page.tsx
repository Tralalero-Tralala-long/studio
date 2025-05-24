
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Gift, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import Image from 'next/image';

export default function GameCodesPage() {
  const { mode } = useAppContext();
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className={`${mode === 'gaming' ? 'bg-card border-primary' : 'bg-card'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className={`w-8 h-8 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
              <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
                Game Codes
              </CardTitle>
            </div>
            <Link href="/" passHref>
              <Button 
                variant="outline" 
                className={cn(
                  mode === 'gaming' ? 'button-glow-gaming hover:border-accent' : 'button-glow-normal hover:border-primary'
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
            Discover and manage your game codes here. Keep an eye out for new additions! Select a category below to find specific codes.
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
          
          <div className="mt-6">
            <Link
              href="/roblox-codes"
              className={cn(
                buttonVariants({ variant: mode === 'gaming' ? 'outline' : 'default', size: 'lg' }),
                "w-full text-lg py-6 flex items-center justify-center gap-2",
                mode === 'gaming' ? 'button-glow-gaming border-accent hover:border-primary' : 'button-glow-normal'
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M12.22 18.04L5.99 21.41l1.22-7.06-5.22-4.73 7.2-.62L12 2.61l3.01 6.39 7.2.62-5.22 4.73 1.22 7.06-6.23-3.37Z"/><path d="M12.22 18.04L12 12l.22 6.04z"/>
                <path d="M12 12l6.23 3.37-1.22-7.06 5.22-4.73-7.2-.62L12 2.61V12z"/>
              </svg> 
              <span>Roblox Game Codes</span>
            </Link>
          </div>

          {/* Placeholder for other game code lists, filtering, or search functionality */}
          <div className="mt-8 p-6 border border-dashed rounded-lg text-center text-muted-foreground">
            Additional game codes or features will be listed here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
