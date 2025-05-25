
"use client";

import { useAppContext, type PromoExample } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Gift, CalendarDays, PlusCircle, CheckSquare, Play, Heart } from "lucide-react";
import Link from "next/link";
import { cn, isCodeExpired } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import AddCodeForm from "@/components/AddCodeForm";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const initialRivalsCodes: PromoExample[] = [
  { id: "rv1", title: "x1 Community Wrap (NEW)", code: "COMMUNITY14", reward: "x1 Community Wrap (NEW)", expiry: "2025-07-16", platform: "Roblox Codes", game: "Rivals", category: "game_code", description: "Get x1 Community Wrap (NEW).", isUsed: false },
  { id: "rv2", title: "5B Visits Finisher", code: "5B_VISITS_WHATTTTTT", reward: "5B Visits Finisher", expiry: "2025-07-16", platform: "Roblox Codes", game: "Rivals", category: "game_code", description: "Get the 5B Visits Finisher.", isUsed: false },
  { id: "rv3", title: "x1 Community Wrap", code: "COMMUNITY13", reward: "x1 Community Wrap", expiry: "2025-07-10", platform: "Roblox Codes", game: "Rivals", category: "game_code", description: "Get x1 Community Wrap.", isUsed: false },
  { id: "rv4", title: "x1 Community Wrap", code: "COMMUNITY12", reward: "x1 Community Wrap", expiry: "2025-07-16", platform: "Roblox Codes", game: "Rivals", category: "game_code", description: "Get x1 Community Wrap.", isUsed: false },
];

export default function RivalsCodesPage() {
  const { mode, isDeveloperMode, saveCoupon, unsaveCoupon, savedCouponIds, isAuthenticated, user } = useAppContext();
  const { toast } = useToast();
  const [codes, setCodes] = useState<PromoExample[]>(
    initialRivalsCodes
      .filter(c => !isCodeExpired(c.expiry))
      .map(c => ({...c, reward: c.reward || c.description, isUsed: c.isUsed || false, id: String(c.id) }))
      .sort((a, b) => {
        if (a.expiry === "Not specified") return 1;
        if (b.expiry === "Not specified") return -1;
        try {
          // Ensure consistent date parsing, especially if dates are mixed format like "yyyy-MM-dd" and "Month Day, Year"
          const dateA = new Date(a.expiry.includes("-") ? a.expiry : parseDateString(a.expiry));
          const dateB = new Date(b.expiry.includes("-") ? b.expiry : parseDateString(b.expiry));
          return dateB.getTime() - dateA.getTime();
        } catch (e) {
          console.error("Error parsing date for sorting:", e);
          return 0;
        }
      })
  );
  const [isAddCodeFormOpen, setIsAddCodeFormOpen] = useState(false);
  const [savingStates, setSavingStates] = useState<{[key: string]: boolean}>({});

  // Helper for robust date parsing if needed for sorting mixed formats
  function parseDateString(dateStr: string): Date {
    // Attempt to parse common formats, this could be expanded
    let parsedDate = new Date(dateStr); // Handles "yyyy-MM-dd" and some others
    if (isNaN(parsedDate.getTime())) {
      // Try "MMMM d, yyyy" or similar; date-fns `parse` is more robust for specific formats
      // For simplicity here, we'll rely on Date constructor's flexibility or ensure data is consistent
      // If using date-fns: parsedDate = parse(dateStr, "MMMM d, yyyy", new Date());
    }
    return parsedDate;
  }

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
      platform: "Roblox Codes",
      game: "Rivals",
      category: "game_code",
      expiry: formData.expiry ? format(formData.expiry, "yyyy-MM-dd") : "Not specified",
      description: formData.description,
      reward: formData.description,
      isUsed: false,
    };

    if (isCodeExpired(newPromo.expiry)) {
        toast({
            title: "Expired Code",
            description: "This code is already expired and will not be added.",
            variant: "destructive",
        });
        setIsAddCodeFormOpen(false);
        return;
    }

    setCodes(prevCodes => [newPromo, ...prevCodes].sort((a, b) => {
        if (a.expiry === "Not specified") return 1;
        if (b.expiry === "Not specified") return -1;
         try {
          const dateA = new Date(a.expiry.includes("-") ? a.expiry : parseDateString(a.expiry));
          const dateB = new Date(b.expiry.includes("-") ? b.expiry : parseDateString(b.expiry));
          return dateB.getTime() - dateA.getTime();
        } catch (e) {
          console.error("Error parsing date for sorting:", e);
          return 0;
        }
      }));
    setIsAddCodeFormOpen(false);
    toast({
      title: "Code Added!",
      description: `"${newPromo.title}" has been successfully added to Rivals.`,
    });
  };

  const handleToggleUsed = (itemId: string) => {
    setCodes(prevCodes =>
      prevCodes.map(code =>
        code.id === itemId ? { ...code, isUsed: !code.isUsed } : code
      )
    );
  };

  const handleSaveToggle = async (promo: PromoExample) => {
    if (!isAuthenticated) {
      toast({ title: "Login Required", description: "Please log in to save coupons.", variant: "destructive"});
      return;
    }
    setSavingStates(prev => ({ ...prev, [promo.id]: true }));
    if (savedCouponIds.includes(promo.id)) {
      await unsaveCoupon(promo.id);
    } else {
      await saveCoupon(promo);
    }
    setSavingStates(prev => ({ ...prev, [promo.id]: false }));
  };

  return (
    <>
      <div className="container mx-auto p-4 md:p-8">
        <Card className={`${mode === 'gaming' ? 'bg-card border-primary' : 'bg-card'}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className={`w-8 h-8 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
                <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
                  <a href="https://www.roblox.com/games/17625359962/RIVALS" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Rivals
                  </a> Codes
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
              Active codes for Rivals. Redeem them in-game for rewards!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {codes.length > 0 ? (
              codes.map((item) => (
                <Card
                  key={item.id}
                  className={cn(
                    `p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 promo-code-card`,
                    mode === 'gaming' ? 'bg-background/30 border-accent' : 'bg-muted',
                    item.isUsed ? 'opacity-60' : ''
                  )}
                >
                  <div className="flex-grow space-y-1">
                    <h3 className={cn(
                        `text-lg font-semibold`,
                        mode === 'gaming' ? 'text-accent-foreground font-rajdhani' : 'text-card-foreground',
                        item.isUsed ? 'line-through' : ''
                      )}>{item.title}</h3>
                    <p className={cn(
                        `font-mono text-lg font-semibold`,
                        mode === 'gaming' ? 'text-primary' : 'text-primary',
                        item.isUsed ? 'line-through' : ''
                      )}>{item.code}</p>
                    {item.reward && item.reward !== item.description && <p className={`text-sm ${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'}`}>Reward: {item.reward}</p>}
                    <p className={`text-xs ${mode === 'gaming' ? 'text-muted-foreground/80 font-rajdhani' : 'text-muted-foreground/80'} italic`}>Details: {item.description}</p>
                    {item.expiry && item.expiry !== "Not specified" && (
                      <div className={`flex items-center text-xs ${mode === 'gaming' ? 'text-muted-foreground/80 font-rajdhani' : 'text-muted-foreground/80'}`}>
                        <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                        <span>Expires: {format(new Date(item.expiry.includes("-") ? item.expiry : parseDateString(item.expiry)), "MMMM d, yyyy")}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 self-end sm:self-center w-full sm:w-auto">
                    <div className="flex items-center space-x-2 order-last sm:order-first mt-2 sm:mt-0">
                      <Checkbox
                        id={`used-${item.id}`}
                        checked={!!item.isUsed}
                        onCheckedChange={() => handleToggleUsed(item.id)}
                        aria-labelledby={`label-used-${item.id}`}
                      />
                      <Label htmlFor={`used-${item.id}`} id={`label-used-${item.id}`} className="text-sm cursor-pointer">
                        Mark as Used
                      </Label>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveToggle(item)}
                        disabled={savingStates[item.id] || !isAuthenticated}
                        className={cn(mode === 'gaming' ? 'button-glow-gaming border-accent hover:border-primary' : 'button-glow-normal', "w-full sm:w-auto")}
                        title={isAuthenticated ? (savedCouponIds.includes(item.id) ? "Unsave Code" : "Save Code") : "Log in to save"}
                      >
                        <Heart className={cn("mr-2 h-4 w-4", savedCouponIds.includes(item.id) ? "fill-red-500 text-red-500" : "")} />
                        {savingStates[item.id] ? "..." : (savedCouponIds.includes(item.id) ? "Saved" : "Save")}
                      </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyCode(item.code)}
                      disabled={!!item.isUsed}
                      className={cn(
                        mode === 'gaming' ? 'button-glow-gaming border-accent hover:border-primary' : 'button-glow-normal',
                        "w-full sm:w-auto"
                      )}
                    >
                      <Copy className="mr-2 h-4 w-4" /> Copy Code
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="p-6 border border-dashed rounded-lg text-center text-muted-foreground">
                No active Rivals codes found at the moment. Check back soon!
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
          formTitle="Add New Rivals Code"
        />
      )}
    </>
  );
}
