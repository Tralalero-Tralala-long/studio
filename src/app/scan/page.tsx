
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanLine } from "lucide-react"; // Using ScanLine for a more direct "scan" visual

export default function ScanPage() {
  const { mode } = useAppContext();
  
  const buttonClass = mode === 'gaming' ? 'button-glow-gaming' : 'button-glow-normal';
  const cardBorderClass = mode === 'gaming' ? 'border-primary' : '';

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className={`shadow-lg ${cardBorderClass} ${mode === 'gaming' ? 'bg-card' : 'bg-card'}`}>
        <CardHeader className="text-center">
          <ScanLine className={`mx-auto h-16 w-16 mb-4 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
          <CardTitle className={`text-3xl md:text-4xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
            Scan for Promo Codes
          </CardTitle>
          <CardDescription className={`text-lg ${mode === 'gaming' ? 'font-rajdhani text-muted-foreground' : 'text-muted-foreground'}`}>
            Ready to find the latest deals? Hit the button below to start scanning!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <p className={`text-center ${mode === 'gaming' ? 'font-rajdhani' : ''}`}>
            PromoPulse will search across various websites and platforms to find active promo codes for you.
            This might take a few moments.
          </p>
          <Button 
            size="lg" 
            className={`${buttonClass} ${mode === 'gaming' ? '' : 'bg-primary hover:bg-primary/90 text-primary-foreground'} text-lg px-12 py-8 font-bold w-full max-w-xs`}
          >
            <ScanLine className="w-6 h-6 mr-3" /> Scan All Codes
          </Button>
          <div className="mt-8 p-6 border border-dashed rounded-lg text-center text-muted-foreground w-full">
            Scanning results and progress will appear here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
