
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function GamingOffersPage() {
  const { mode } = useAppContext();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className={`${mode === 'gaming' ? 'bg-card border-primary text-primary-foreground' : 'bg-card'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 className={`w-8 h-8 ${mode === 'gaming' ? 'text-accent' : 'text-primary'}`} />
              <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
                Gaming Offers
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
            Find the latest discounts on games, DLCs, and gaming subscriptions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-6 border border-dashed rounded-lg text-center text-muted-foreground">
            <p className="text-lg">Current Gaming Offers:</p>
            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li>Steam Summer Sale: Up to 75% off select titles!</li>
              <li>Epic Games Store: Free mystery game this week!</li>
              <li>Xbox Game Pass: First month for $1.</li>
            </ul>
            <p className="mt-6 text-sm">
              Offers are subject to change and availability. Check respective platforms for details.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
