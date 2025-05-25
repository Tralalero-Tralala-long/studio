
"use client";

import { useAppContext, type PromoExample } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Copy, CalendarDays, Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { cn, isCodeExpired } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function MyCouponsPage() {
  const { mode, user, isAuthenticated, unsaveCoupon, savedCouponIds } = useAppContext();
  const [savedPromos, setSavedPromos] = useState<PromoExample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && user) {
      setIsLoading(true);
      const fetchSavedPromos = async () => {
        try {
          const q = query(collection(db, "userCoupons", user.uid, "savedCodes"));
          const querySnapshot = await getDocs(q);
          const promos = querySnapshot.docs
            .map(doc => doc.data() as PromoExample)
            .filter(promo => !isCodeExpired(promo.expiry)); // Filter out expired codes
          setSavedPromos(promos.sort((a,b) => new Date(b.expiry).getTime() - new Date(a.expiry).getTime()));
        } catch (error) {
          console.error("Error fetching saved promos: ", error);
          toast({ title: "Error", description: "Could not load your saved coupons.", variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };
      fetchSavedPromos();
    } else {
      setIsLoading(false);
      setSavedPromos([]); // Clear if user logs out
    }
  }, [isAuthenticated, user, toast, savedCouponIds]); // Re-fetch if savedCouponIds changes (e.g., after unsaving)

  const handleCopyCode = (codeToCopy: string) => {
    navigator.clipboard.writeText(codeToCopy).then(() => {
      toast({
        title: "Code Copied!",
        description: `${codeToCopy} copied to clipboard.`,
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

  const handleUnsave = async (promoId: string) => {
    await unsaveCoupon(promoId);
    // The useEffect above will re-filter and update savedPromos
  };

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <Card className={`${mode === 'gaming' ? 'bg-card border-primary' : 'bg-card'} shadow-lg`}>
          <CardHeader>
            <Ticket className={`w-12 h-12 mx-auto mb-4 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
            <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
              My Coupons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-lg mb-4 ${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'}`}>
              Please log in to view your saved coupons.
            </p>
            <Link href="/login">
              <Button className={`${mode === 'gaming' ? 'button-glow-gaming' : 'button-glow-normal'}`}>Log In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className={`${mode === 'gaming' ? 'bg-card border-primary' : 'bg-card'} shadow-lg`}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Ticket className={`w-8 h-8 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
            <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
              My Saved Coupons
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading your coupons...</p>
          ) : savedPromos.length > 0 ? (
            <div className="space-y-4">
              {savedPromos.map((item) => (
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
                    <p className={`text-sm ${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'}`}>
                      {item.description} ({item.platform} {item.game ? `- ${item.game}` : ''})
                    </p>
                    {item.expiry && item.expiry !== "Not specified" && (
                      <div className={`flex items-center text-xs ${mode === 'gaming' ? 'text-muted-foreground/80 font-rajdhani' : 'text-muted-foreground/80'}`}>
                        <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                        <span>Expires: {format(new Date(item.expiry.includes("-") ? item.expiry : item.expiry), "MMMM d, yyyy")}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 self-end sm:self-center w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnsave(item.id)}
                      className={cn(
                        mode === 'gaming' ? 'button-glow-gaming border-accent hover:border-destructive' : 'button-glow-normal hover:border-destructive',
                        "w-full sm:w-auto"
                      )}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Unsave
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
              ))}
            </div>
          ) : (
            <div className="p-6 border border-dashed rounded-lg text-center text-muted-foreground">
              You haven't saved any coupons yet. Start browsing to find some great deals!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
