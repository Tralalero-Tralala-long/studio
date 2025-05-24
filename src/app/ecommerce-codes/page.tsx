
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { ShoppingCart, Store, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const platformCategories = [
  { name: "Myntra", href: "/ecommerce-codes/myntra", icon: <Store className="mr-2 h-5 w-5" /> },
  { name: "Flipkart", href: "/ecommerce-codes/flipkart", icon: <Store className="mr-2 h-5 w-5" /> },
  { name: "Amazon", href: "/ecommerce-codes/amazon", icon: <Store className="mr-2 h-5 w-5" /> },
  { name: "Blinkit", href: "/ecommerce-codes/blinkit", icon: <Store className="mr-2 h-5 w-5" /> },
];

export default function EcommerceCodesPage() {
  const { mode } = useAppContext();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className={`${mode === 'gaming' ? 'bg-card border-primary' : 'bg-card'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className={`w-8 h-8 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
              <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
                E-commerce Platforms
              </CardTitle>
            </div>
            {/* Removed "Back to Code Categories" button */}
          </div>
          <CardDescription className={`${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'} pt-2`}>
            Select an e-commerce platform below to find promo codes.
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
            More e-commerce platforms will be listed here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
