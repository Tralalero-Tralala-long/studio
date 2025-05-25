
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Box } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LootDropsPage() {
  const { mode } = useAppContext();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className={`${mode === 'gaming' ? 'bg-card border-primary text-primary-foreground' : 'bg-card'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Box className={`w-8 h-8 ${mode === 'gaming' ? 'text-accent' : 'text-primary'}`} />
              <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
                Loot Drops
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
          <CardDescription className={`${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'} pt-2`}>
            Discover exciting daily loot drops and in-game items here!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-6 border border-dashed rounded-lg text-center text-muted-foreground">
            <p className="text-lg">Today's Loot Drops:</p>
            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li>Legendary Sword Skin (Expires in 24h!)</li>
              <li>+500 In-Game Currency</li>
              <li>Rare Character Emote</li>
            </ul>
            <p className="mt-6 text-sm">
              Check back daily for new loot! Actual items and availability depend on integrated game services.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
