
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, ArrowLeft } from "lucide-react"; // Using Code icon, added ArrowLeft
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
            Manage and view your specific Roblox game codes here.
          </p>
          
          {/* Placeholder for specific Roblox game code listings or sub-wallets */}
          <div className="mt-8 p-6 border border-dashed rounded-lg text-center text-muted-foreground">
            Specific Roblox codes (e.g., for Blox Fruits, Anime Champions Simulator, etc.) will be displayed here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
