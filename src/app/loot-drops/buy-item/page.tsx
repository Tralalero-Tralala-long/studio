
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function BuyLootItemPage() {
  const { mode } = useAppContext();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className={cn(
        mode === 'gaming' ? 'bg-card border-primary text-primary-foreground' : 'bg-card',
        "shadow-xl"
      )}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className={`w-8 h-8 ${mode === 'gaming' ? 'text-accent' : 'text-primary'}`} />
              <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
                Confirm Loot Purchase
              </CardTitle>
            </div>
            <Link href="/loot-drops" passHref>
              <Button
                variant="outline"
                className={cn(
                  mode === 'gaming' ? 'button-glow-gaming hover:border-accent' : 'button-glow-normal hover:border-primary'
                )}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Loot Drops
              </Button>
            </Link>
          </div>
          <CardDescription className={cn(
            mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground',
            "pt-2"
          )}>
            Review your item and confirm your purchase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-6 border border-dashed rounded-lg text-center text-muted-foreground">
            <p className="text-lg">Item: Legendary Sword Skin</p>
            <p className="text-lg">Price: 500 Gems</p>
            <Button 
              className={cn(
                "mt-6",
                mode === 'gaming' ? 'button-glow-gaming' : 'button-glow-normal'
              )}
            >
              Confirm Purchase
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
