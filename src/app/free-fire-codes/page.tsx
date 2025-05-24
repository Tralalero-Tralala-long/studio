
"use client";

import { useAppContext, type PromoExample } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gamepad2, Copy, PlusCircle, CalendarDays } from "lucide-react"; // Added PlusCircle, CalendarDays
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react"; // Added useState
import AddCodeForm from "@/components/AddCodeForm"; // Added AddCodeForm
import { format } from "date-fns"; // Added format

const initialFreeFireCodes: PromoExample[] = [
  // Placeholder - can be populated by developer mode
];

export default function FreeFireCodesPage() {
  const { mode, isDeveloperMode } = useAppContext();
  const { toast } = useToast();
  const [codes, setCodes] = useState<PromoExample[]>(initialFreeFireCodes);
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
    const newPromo: PromoExample = {
      id: Date.now().toString(),
      title: formData.title,
      code: formData.code,
      platform: "Free Fire (Garena)", 
      category: "game_code",
      expiry: formData.expiry ? format(formData.expiry, "yyyy-MM-dd") : "Not specified",
      description: formData.description,
    };
    setCodes(prevCodes => [...prevCodes, newPromo]);
    setIsAddCodeFormOpen(false);
    toast({
      title: "Code Added!",
      description: `"${newPromo.title}" has been successfully added to Free Fire Codes.`,
    });
  };

  return (
    <>
      <div className="container mx-auto p-4 md:p-8">
        <Card className={`${mode === 'gaming' ? 'bg-card border-primary' : 'bg-card'}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gamepad2 className={`w-8 h-8 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
                <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
                  Free Fire (Garena) Game Codes
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {isDeveloperMode && (
                  <Button variant="outline" onClick={() => setIsAddCodeFormOpen(true)} className={cn(mode === 'gaming' ? 'button-glow-gaming' : 'button-glow-normal')}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Code
                  </Button>
                )}
                <Link href="/game-codes" passHref>
                  <Button 
                    variant="outline" 
                    className={cn(
                      mode === 'gaming' ? 'button-glow-gaming hover:border-accent' : 'button-glow-normal hover:border-primary'
                    )}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to All Game Codes
                  </Button>
                </Link>
              </div>
            </div>
            <CardDescription className={`${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'} pt-2`}>
              Active codes for Free Fire (Garena). Redeem them in-game for rewards!
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
                    <p className={`text-sm ${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'}`}>{item.description}</p>
                     {item.expiry && item.expiry !== "Not specified" && (
                      <div className={`flex items-center text-xs ${mode === 'gaming' ? 'text-muted-foreground/80 font-rajdhani' : 'text-muted-foreground/80'}`}>
                        <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                        <span>Expires: {item.expiry}</span>
                      </div>
                    )}
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
                No active Free Fire (Garena) codes found at the moment. Check back soon!
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
          formTitle="Add New Free Fire Code"
        />
      )}
    </>
  );
}
