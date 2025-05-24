
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const platformCategories = [
  { name: "Zomato", href: "/delivery-codes/zomato", icon: <Truck className="mr-2 h-5 w-5" /> },
  { name: "Swiggy", href: "/delivery-codes/swiggy", icon: <Truck className="mr-2 h-5 w-5" /> },
  { name: "Dunzo", href: "/delivery-codes/dunzo", icon: <Truck className="mr-2 h-5 w-5" /> },
];

export default function DeliveryCodesHubPage() {
  const { mode } = useAppContext();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className={`${mode === 'gaming' ? 'bg-card border-primary' : 'bg-card'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className={`w-8 h-8 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
              <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
                Delivery Platforms
              </CardTitle>
            </div>
            <Link href="/game-codes" passHref> {/* Link back to the main categories page */}
              <Button 
                variant="outline" 
                className={cn(
                  mode === 'gaming' ? 'button-glow-gaming hover:border-accent' : 'button-glow-normal hover:border-primary'
                )}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Code Categories
              </Button>
            </Link>
          </div>
          <CardDescription className={`${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'} pt-2`}>
            Select a delivery platform below to find promo codes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platformCategories.map((platform) => (
              <Link
                key={platform.name}
                href={platform.href}
                className={cn(
                  buttonVariants({ variant: mode === 'gaming' ? 'outline' : 'default', size: 'lg' }),
                  "w-full text-lg py-6 flex items-center justify-center gap-2",
                  mode === 'gaming' ? 'button-glow-gaming border-accent hover:border-primary' : 'button-glow-normal'
                )}
              >
                {platform.icon}
                <span>{platform.name} Codes</span>
              </Link>
            ))}
          </div>
          <div className="mt-8 p-6 border border-dashed rounded-lg text-center text-muted-foreground">
            More delivery platforms will be listed here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
