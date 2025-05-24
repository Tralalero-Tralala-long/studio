
"use client";

import { useAppContext, type PromoExample } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Gift, CalendarDays, PlusCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import AddCodeForm from "@/components/AddCodeForm";
import { format } from "date-fns";

const initialBloxFruitsCodes: PromoExample[] = [
  { id: "bf1", title: "2x XP Boost", code: "NOMOREHACK", reward: "20 minutes of 2x Experience", expiry: "June 9, 2025", platform: "Roblox Codes", game: "Blox Fruits", category: "game_code", description: "Get 20 minutes of 2x Experience in Blox Fruits." },
  { id: "bf2", title: "Another XP Boost", code: "BANEXPLOIT", reward: "20 minutes of 2x Experience", expiry: "April 2, 2025", platform: "Roblox Codes", game: "Blox Fruits", category: "game_code", description: "Enjoy another 20 minutes of 2x Experience." },
  { id: "bf3", title: "Fruit Finder", code: "EARN_FRUITS", reward: "20 minutes of 2x Experience", expiry: "June 19, 2025", platform: "Roblox Codes", game: "Blox Fruits", category: "game_code", description: "This code also grants 20 minutes of 2x Experience." },
  { id: "bf4", title: "Battle XP", code: "FIGHT4FRUIT", reward: "20 minutes of 2x Experience", expiry: "July 2, 2025", platform: "Roblox Codes", game: "Blox Fruits", category: "game_code", description: "One more code for 20 minutes of 2x Experience!" },
];

interface BloxFruitCodeDisplayItem extends PromoExample {
  reward: string; // Keep reward for display consistency if specific structure is used
}


export default function BloxFruitsCodesPage() {
  const { mode, isDeveloperMode } = useAppContext();
  const { toast } = useToast();
  const [codes, setCodes] = useState<BloxFruitCodeDisplayItem[]>(initialBloxFruitsCodes.map(c => ({...c, reward: c.description }))); // Adapt description to reward for display
  const [isAddCodeFormOpen, setIsAddCodeFormOpen] = useState(false);

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

  const handleAddCodeSubmit = (formData: { title: string; code: string; expiry?: Date; description: string }) => {
    const newPromo: BloxFruitCodeDisplayItem = {
      id: Date.now().toString(),
      title: formData.title,
      code: formData.code,
      platform: "Roblox Codes", // Context specific
      game: "Blox Fruits",       // Context specific
      category: "game_code",     // Context specific
      expiry: formData.expiry ? format(formData.expiry, "yyyy-MM-dd") : "Not specified",
      description: formData.description,
      reward: formData.description, // Using description as reward for simplicity here
    };
    setCodes(prevCodes => [...prevCodes, newPromo]);
    setIsAddCodeFormOpen(false);
    toast({
      title: "Code Added!",
      description: `"${newPromo.title}" has been successfully added to Blox Fruits.`,
    });
  };


  return (
    <>
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
              <div className="flex items-center gap-2">
                {isDeveloperMode && (
                  <Button variant="outline" onClick={() => setIsAddCodeFormOpen(true)} className={cn(mode === 'gaming' ? 'button-glow-gaming' : 'button-glow-normal')}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Code
                  </Button>
                )}
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
            </div>
            <CardDescription className={`${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'} pt-2`}>
              Active codes for Blox Fruits. Redeem them in-game for rewards! Make sure to use them before they expire.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {codes.length > 0 ? (
              codes.map((item) => (
                <Card 
                  key={item.id} 
                  className={`p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${mode === 'gaming' ? 'bg-background/30 border-accent' : 'bg-muted'}`}
                >
                  <div className="flex-grow space-y-1">
                    <h3 className={`text-lg font-semibold ${mode === 'gaming' ? 'text-accent-foreground font-rajdhani' : 'text-card-foreground'}`}>{item.title}</h3>
                    <p className={`font-mono text-lg font-semibold ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`}>{item.code}</p>
                    <p className={`text-sm ${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'}`}>{item.reward}</p> {/* Using reward prop */}
                     <p className={`text-xs ${mode === 'gaming' ? 'text-muted-foreground/80 font-rajdhani' : 'text-muted-foreground/80'} italic`}>Details: {item.description}</p>
                    <div className={`flex items-center text-xs ${mode === 'gaming' ? 'text-muted-foreground/80 font-rajdhani' : 'text-muted-foreground/80'}`}>
                      <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                      <span>Expires: {item.expiry}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCopyCode(item.code)}
                    className={cn(
                      mode === 'gaming' ? 'button-glow-gaming border-accent hover:border-primary' : 'button-glow-normal',
                      "w-full sm:w-auto mt-2 sm:mt-0 self-end sm:self-center" 
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
      {isDeveloperMode && (
        <AddCodeForm
          isOpen={isAddCodeFormOpen}
          setIsOpen={setIsAddCodeFormOpen}
          onSubmitCode={handleAddCodeSubmit}
          formTitle="Add New Blox Fruits Code"
        />
      )}
    </>
  );
}
