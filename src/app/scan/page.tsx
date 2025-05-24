
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanLine, QrCode } from "lucide-react"; // Using ScanLine for a more direct "scan" visual
import Image from "next/image";

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
            Ready to find the latest deals? Hit the button below to start scanning! You can also scan a QR code.
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

          <Card className={`mt-8 w-full max-w-sm ${cardBorderClass} ${mode === 'gaming' ? 'bg-card' : 'bg-card'}`}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <QrCode className={`w-6 h-6 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
                <CardTitle className={`${mode === 'gaming' ? 'font-orbitron' : ''} text-xl`}>
                  Scan QR Code
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <p className={`mb-4 text-sm ${mode === 'gaming' ? 'font-rajdhani text-muted-foreground' : 'text-muted-foreground'}`}>
                Place your QR code image (e.g., 'qr-code.png') in the 'public/images/' folder of your project.
                Then, update the 'src' below to '/images/qr-code.png'.
              </p>
              <div className="w-48 h-48 md:w-64 md:h-64 relative bg-muted rounded-md flex items-center justify-center">
                {/* 
                  TODO: Replace the src below with your actual QR code image path 
                  e.g., /images/your-qr-code-filename.png 
                  Ensure the image is in your project's 'public/images/' folder.
                */}
                <Image
                  src="https://placehold.co/256x256.png" 
                  alt="QR Code Placeholder - Replace with your QR code"
                  data-ai-hint="QR code scan"
                  width={256}
                  height={256}
                  className="rounded-md object-contain"
                />
              </div>
              <p className={`mt-4 text-xs ${mode === 'gaming' ? 'font-rajdhani text-muted-foreground' : 'text-muted-foreground'}`}>
                (Example QR code shown)
              </p>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
}
