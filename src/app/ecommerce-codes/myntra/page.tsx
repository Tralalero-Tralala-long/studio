
"use client";

import { useAppContext, type PromoExample } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Copy, PlusCircle, CalendarDays, ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import { cn, isCodeExpired } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import AddCodeForm from "@/components/AddCodeForm";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const initialMyntraCodes: PromoExample[] = [
  { id: "myntra1", title: "FLAT ₹500 OFF", code: "MYNTRA500", expiry: "2025-07-31", platform: "Myntra", category: "fashion", description: "Flat ₹500 off on minimum purchase ₹2,999.", isUsed: false },
  { id: "myntra2", title: "FLAT ₹300 OFF + Free Shipping", code: "MYNTRA300", expiry: "2025-05-31", platform: "Myntra", category: "fashion", description: "Flat ₹300 off + Free Shipping on minimum purchase ₹1,099.", isUsed: false },
  { id: "myntra3", title: "₹300 OFF + Up to 50% Off", code: "FLAT300", expiry: "2025-05-31", platform: "Myntra", category: "fashion", description: "₹300 off + up to 50% off on minimum purchase ₹999.", isUsed: false },
  { id: "myntra4", title: "30% OFF", code: "WED30PERCENTOFF", expiry: "2025-05-31", platform: "Myntra", category: "fashion", description: "30% off.", isUsed: false },
];

export default function MyntraCodesPage() {
  const { mode, isDeveloperMode, saveCoupon, unsaveCoupon, savedCouponIds, isAuthenticated, user } = useAppContext();
  const { toast } = useToast();
  const [codes, setCodes] = useState<PromoExample[]>(
    initialMyntraCodes
      .filter(c => !isCodeExpired(c.expiry))
      .map(c => ({ ...c, isUsed: c.isUsed || false, id: String(c.id) }))
  );
  const [isAddCodeFormOpen, setIsAddCodeFormOpen] = useState(false);
  const [savingStates, setSavingStates] = useState<{[key: string]: boolean}>({});

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
      platform: "Myntra",
      category: "fashion_ecommerce",
      expiry: formData.expiry ? format(formData.expiry, "yyyy-MM-dd") : "Not specified",
      description: formData.description,
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

    setCodes(prevCodes => [...prevCodes, newPromo]);
    setIsAddCodeFormOpen(false);
    toast({
      title: "Code Added!",
      description: `"${newPromo.title}" has been successfully added to Myntra Codes.`,
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
                <Store className={`w-8 h-8 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
                <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
                  <a
                    href="https://www.myntra.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Myntra
                  </a> Promo Codes
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {isDeveloperMode && (
                  <Button variant="outline" onClick={() => setIsAddCodeFormOpen(true)} className={cn(mode === 'gaming' ? 'button-glow-gaming' : 'button-glow-normal')}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Code
                  </Button>
                )}
                <Link href="/ecommerce-codes" passHref>
                  <Button
                    variant="outline"
                    className={cn(
                      mode === 'gaming' ? 'button-glow-gaming hover:border-accent' : 'button-glow-normal hover:border-primary'
                    )}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to E-commerce Platforms
                  </Button>
                </Link>
              </div>
            </div>
            <CardDescription className={`${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'} pt-2`}>
              Active promo codes for Myntra.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {codes.length > 0 ? (
              codes.map((item) => (
                <Card
                  key={item.id}
                  className={cn(
                    `p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`,
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
                    <p className={`text-sm ${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'}`}>{item.description}</p>
                    {item.expiry && item.expiry !== "Not specified" && (
                      <div className={`flex items-center text-xs ${mode === 'gaming' ? 'text-muted-foreground/80 font-rajdhani' : 'text-muted-foreground/80'}`}>
                        <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                        <span>Expires: {format(new Date(item.expiry), "MMMM d, yyyy")}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 self-end sm:self-center w-full sm:w-auto">
                    <div className="flex items-center space-x-2 order-last sm:order-first mt-2 sm:mt-0">
                      <Checkbox
                        id={`used-${item.id}`}
                        checked={item.isUsed}
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
                      disabled={item.isUsed}
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
                No active Myntra codes found at the moment. Check back soon!
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
          formTitle="Add New Myntra Code"
        />
      )}
    </>
  );
}
