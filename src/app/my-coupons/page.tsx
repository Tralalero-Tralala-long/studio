
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "lucide-react";

export default function MyCouponsPage() {
  const { mode } = useAppContext();
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className={`${mode === 'gaming' ? 'bg-card border-primary' : 'bg-card'}`}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Ticket className={`w-8 h-8 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
            <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
              My Coupons
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className={`text-lg ${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'}`}>
            This is where your saved promo codes and coupons will be displayed. Stay tuned for updates!
          </p>
          {/* Placeholder for coupon list */}
          <div className="mt-6 p-6 border border-dashed rounded-lg text-center text-muted-foreground">
            No coupons saved yet. Start scanning to find amazing deals!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
