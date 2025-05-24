
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Gift } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface BloxFruitCode {
  code: string;
  reward: string;
  id: string;
}

const bloxFruitsCodes: BloxFruitCode[] = [
  { id: "bf1", code: "NOMOREHACK", reward: "20 minutes of 2x Experience" },
  { id: "bf2", code: "BANEXPLOIT", reward: "20 minutes of 2x Experience" },
  { id: "bf3", code: "EARN_FRUITS", reward: "20 minutes of 2x Experience" },
  { id: "bf4", code: "FIGHT4FRUIT", reward: "20 minutes of 2x Experience" },
];

export default function BloxFruitsCodesPage() {
  const { mode } = useAppContext();
  const { toast } = useToast();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast({
        title: "Code Copied!",
        description: `${code} copied to clipboard.`,
      });
    }).catch(err => {
      console.error('Failed to copy code: ', err);
      toast({
        title: "Error",
        description: "Failed to copy code.",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className={`${mode === 'gaming' ? 'bg-card border-primary' : 'bg-card'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className={`w-8 h-8 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
              <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
                Blox Fruits Codes
              </CardTitle>
            </div>
            <Link href="/roblox-codes" passHref>
              <Button 
                variant="outline" 
                className={cn(
                  mode === 'gaming' ? 'button-glow-gaming hover:border-accent' : 'button-glow-normal hover:border-primary'
                )}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Roblox Games
              </Button>
            </Link>
          </div>
          <CardDescription className={`${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'} pt-2`}>
            Active codes for Blox Fruits. Redeem them in-game for rewards!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bloxFruitsCodes.length > 0 ? (
            bloxFruitsCodes.map((item) => (
              <Card 
                key={item.id} 
                className={`p-4 flex flex-col sm:flex-row justify-between items-center gap-4 ${mode === 'gaming' ? 'bg-background/30 border-accent' : 'bg-muted'}`}
              >
                <div className="flex-grow">
                  <p className={`font-mono text-lg font-semibold ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`}>{item.code}</p>
                  <p className={`text-sm ${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'}`}>{item.reward}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleCopyCode(item.code)}
                  className={cn(
                    mode === 'gaming' ? 'button-glow-gaming border-accent hover:border-primary' : 'button-glow-normal',
                    "w-full sm:w-auto" 
                  )}
                >
                  <Copy className="mr-2 h-4 w-4" /> Copy Code
                </Button>
              </Card>
            ))
          ) : (
            <div className="p-6 border border-dashed rounded-lg text-center text-muted-foreground">
              No active Blox Fruits codes found at the moment. Check back soon!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

