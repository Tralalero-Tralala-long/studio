
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Box, ShoppingCart, Eye } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast"; // Import useToast

interface LootDropItemProps {
  title: string;
  mode: 'shopping' | 'gaming';
  onBuyClick: () => void;
  onViewClick: () => void;
}

function LootDropItem({ title, mode, onBuyClick, onViewClick }: LootDropItemProps) {
  return (
    <Card className={cn(
      "w-full p-6 shadow-lg",
      mode === 'gaming' ? 'bg-background/30 border-accent' : 'bg-muted'
    )}>
      <CardHeader className="p-0 pb-4">
        <CardTitle className={cn(
          "text-xl text-center", 
          mode === 'gaming' ? 'font-rajdhani text-accent-foreground' : 'text-card-foreground'
        )}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col sm:flex-row justify-around items-center gap-4">
        <Button
          variant={mode === 'gaming' ? 'outline' : 'default'}
          className={cn(
            "w-full",
            mode === 'gaming' ? 'button-glow-gaming border-accent hover:border-primary' : 'button-glow-normal'
          )}
          onClick={onBuyClick}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Buy Item
        </Button>
        <Button
          variant="outline"
          className={cn(
            "w-full",
            mode === 'gaming' ? 'button-glow-gaming hover:border-accent' : 'button-glow-normal hover:border-primary'
          )}
          onClick={onViewClick}
        >
          <Eye className="mr-2 h-5 w-5" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}

export default function LootDropsPage() {
  const { mode } = useAppContext();
  const { toast } = useToast(); // Initialize toast

  const handleComingSoon = () => {
    toast({
      title: "Coming Soon!",
      description: "This feature is under development.",
    });
  };

  const lootDrops = [
    { id: "1", title: "Roblox Loot Drops" },
    { id: "2", title: "Fortnite Loot Drops" },
    { id: "3", title: "Xbox Loot Drops" },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className={cn(
        mode === 'gaming' ? 'bg-card border-primary text-primary-foreground' : 'bg-card',
        "shadow-xl"
      )}>
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
          <CardDescription className={cn(
            mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground',
            "pt-2"
          )}>
            Check out the featured loot drops below! (More features coming soon)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {lootDrops.map(drop => (
              <LootDropItem 
                key={drop.id} 
                title={drop.title} 
                mode={mode}
                onBuyClick={handleComingSoon}
                onViewClick={handleComingSoon}
              />
            ))}
          </div>
          <p className={cn(
            "text-sm text-center mt-8", 
            mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'
          )}>
            More loot drops coming soon. Check back daily!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
