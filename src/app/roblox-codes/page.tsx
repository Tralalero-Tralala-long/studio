
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, ArrowLeft, Play } from "lucide-react";
import Link from 'next/link';
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function RobloxCodesPage() {
  const { mode } = useAppContext();
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className={`${mode === 'gaming' ? 'bg-card border-primary' : 'bg-card'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className={`w-8 h-8 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
              <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
                Roblox Game Codes
              </CardTitle>
            </div>
            <Link href="/game-codes" passHref>
              <Button 
                variant="outline" 
                className={cn(
                  mode === 'gaming' ? 'button-glow-gaming hover:border-accent' : 'button-glow-normal hover:border-primary'
                )}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Game Codes
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className={`text-lg ${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'}`}>
            Select a game below to view its specific codes.
          </p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/roblox-codes/blox-fruits"
              className={cn(
                buttonVariants({ variant: mode === 'gaming' ? 'outline' : 'default', size: 'lg' }),
                "w-full text-lg py-6 flex items-center justify-center gap-2",
                mode === 'gaming' ? 'button-glow-gaming border-accent hover:border-primary' : 'button-glow-normal'
              )}
            >
              <Play className="mr-2 h-5 w-5" /> 
              <span>Blox Fruits Codes</span>
            </Link>
            <Link
              href="/roblox-codes/blade-ball"
              className={cn(
                buttonVariants({ variant: mode === 'gaming' ? 'outline' : 'default', size: 'lg' }),
                "w-full text-lg py-6 flex items-center justify-center gap-2",
                mode === 'gaming' ? 'button-glow-gaming border-accent hover:border-primary' : 'button-glow-normal'
              )}
            >
              <Play className="mr-2 h-5 w-5" /> 
              <span>Blade Ball Codes</span>
            </Link>
            <Link
              href="/roblox-codes/arm-wrestle-simulator"
              className={cn(
                buttonVariants({ variant: mode === 'gaming' ? 'outline' : 'default', size: 'lg' }),
                "w-full text-lg py-6 flex items-center justify-center gap-2",
                mode === 'gaming' ? 'button-glow-gaming border-accent hover:border-primary' : 'button-glow-normal'
              )}
            >
              <Play className="mr-2 h-5 w-5" /> 
              <span>Arm Wrestle Simulator Codes</span>
            </Link>
            <Link
              href="/roblox-codes/rivals"
              className={cn(
                buttonVariants({ variant: mode === 'gaming' ? 'outline' : 'default', size: 'lg' }),
                "w-full text-lg py-6 flex items-center justify-center gap-2",
                mode === 'gaming' ? 'button-glow-gaming border-accent hover:border-primary' : 'button-glow-normal'
              )}
            >
              <Play className="mr-2 h-5 w-5" /> 
              <span>Rivals Codes</span>
            </Link>
          </div>

          <div className="mt-8 p-6 border border-dashed rounded-lg text-center text-muted-foreground">
            More Roblox game categories will be listed here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
