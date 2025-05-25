
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ViewLootItemPage() {
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
              <Eye className={`w-8 h-8 ${mode === 'gaming' ? 'text-accent' : 'text-primary'}`} />
              <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
                Loot Item Details
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
            Details of the featured loot item.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col items-center">
          <div className="w-full max-w-sm p-6 border border-dashed rounded-lg text-center text-muted-foreground">
            <Image 
              src="https://placehold.co/300x200.png"
              alt="Loot Item Image"
              data-ai-hint="fantasy weapon sword"
              width={300}
              height={200}
              className="rounded-md mx-auto mb-4 shadow-md"
            />
            <h3 className={cn(
              "text-xl font-semibold mb-2",
              mode === 'gaming' ? 'text-accent-foreground font-rajdhani' : 'text-card-foreground'
            )}>
              Legendary Sword Skin
            </h3>
            <p className="text-sm">A rare skin for your sword, imbued with ancient power.</p>
            <p className="text-sm mt-1">Type: Cosmetic Skin</p>
            <p className="text-sm mt-1">Rarity: Legendary</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
