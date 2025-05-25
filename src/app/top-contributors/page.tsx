
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Users, Award, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Image from 'next/image';
import { cn } from "@/lib/utils";

interface Contributor {
  id: string;
  username: string;
  promoPoints: number;
  avatarUrl?: string; // Optional: for future use
}

const addPromoPointsFormSchema = z.object({
  contributorUsername: z.string().min(1, { message: "Contributor username is required." }),
  pointsToAdd: z.coerce.number().int().positive({ message: "PromoPoints must be a positive number." }),
});

type AddPromoPointsFormValues = z.infer<typeof addPromoPointsFormSchema>;

// Placeholder initial data
const initialContributors: Contributor[] = [
  { id: "1", username: "PromoKing123", promoPoints: 1500, avatarUrl: "https://placehold.co/40x40.png" },
  { id: "2", username: "DealHunterX", promoPoints: 1250, avatarUrl: "https://placehold.co/40x40.png" },
  { id: "3", username: "CouponQueen", promoPoints: 900, avatarUrl: "https://placehold.co/40x40.png" },
  { id: "4", username: "SavvyShopper", promoPoints: 750, avatarUrl: "https://placehold.co/40x40.png" },
  { id: "5", username: "therealdev0025", promoPoints: 50, avatarUrl: "https://placehold.co/40x40.png" },
];

export default function TopContributorsPage() {
  const { mode, isDeveloperMode } = useAppContext();
  const { toast } = useToast();
  const [contributors, setContributors] = useState<Contributor[]>(initialContributors);
  const [isAddPointsDialogOpen, setIsAddPointsDialogOpen] = useState(false);

  const form = useForm<AddPromoPointsFormValues>({
    resolver: zodResolver(addPromoPointsFormSchema),
    defaultValues: {
      contributorUsername: "",
      pointsToAdd: 0,
    },
  });

  useEffect(() => {
    // Sort contributors by promoPoints whenever the list changes
    setContributors(prev => [...prev].sort((a, b) => b.promoPoints - a.promoPoints));
  }, []); // Initial sort

  const handleAddPromoPointsSubmit = (data: AddPromoPointsFormValues) => {
    setContributors(prevContributors => {
      const contributorIndex = prevContributors.findIndex(
        c => c.username.toLowerCase() === data.contributorUsername.toLowerCase()
      );

      if (contributorIndex === -1) {
        toast({
          title: "Error",
          description: `Contributor "${data.contributorUsername}" not found.`,
          variant: "destructive",
        });
        return prevContributors;
      }

      const updatedContributors = [...prevContributors];
      updatedContributors[contributorIndex] = {
        ...updatedContributors[contributorIndex],
        promoPoints: updatedContributors[contributorIndex].promoPoints + data.pointsToAdd,
      };
      
      toast({
        title: "Success!",
        description: `${data.pointsToAdd} PromoPoints added to ${updatedContributors[contributorIndex].username}.`,
      });
      
      // Sort after updating points
      return updatedContributors.sort((a, b) => b.promoPoints - a.promoPoints);
    });

    form.reset();
    setIsAddPointsDialogOpen(false);
  };

  return (
    <>
      <div className="container mx-auto p-4 md:p-8">
        <Card className={cn(mode === 'gaming' ? 'bg-card border-primary' : 'bg-card', 'shadow-xl')}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className={`w-8 h-8 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
                <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
                  Top Contributors Leaderboard
                </CardTitle>
              </div>
              {isDeveloperMode && (
                <Dialog open={isAddPointsDialogOpen} onOpenChange={setIsAddPointsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className={cn(mode === 'gaming' ? 'button-glow-gaming' : 'button-glow-normal')}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add PromoPoints
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add PromoPoints to Contributor</DialogTitle>
                      <DialogDescription>
                        Enter the contributor's username and the number of PromoPoints to add.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(handleAddPromoPointsSubmit)} className="space-y-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="contributorUsername">Contributor Username</Label>
                        <Input
                          id="contributorUsername"
                          placeholder="e.g., PromoKing123"
                          {...form.register("contributorUsername")}
                        />
                        {form.formState.errors.contributorUsername && (
                          <p className="text-sm text-destructive">{form.formState.errors.contributorUsername.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pointsToAdd">PromoPoints Gained</Label>
                        <Input
                          id="pointsToAdd"
                          type="number"
                          placeholder="e.g., 100"
                          {...form.register("pointsToAdd")}
                        />
                        {form.formState.errors.pointsToAdd && (
                          <p className="text-sm text-destructive">{form.formState.errors.pointsToAdd.message}</p>
                        )}
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddPointsDialogOpen(false)}>Cancel</Button>
                        <Button type="submit">
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Points
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <CardDescription className={cn(mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground', 'pt-2')}>
              Check out our most active promo code contributors! Points are awarded for valuable contributions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {contributors.length > 0 ? (
              <div className="space-y-4">
                {contributors.map((contributor, index) => (
                  <Card 
                    key={contributor.id} 
                    className={cn(
                      `p-4 flex items-center justify-between gap-4 transition-all duration-300 hover:shadow-md`,
                      mode === 'gaming' ? 'bg-background/30 border-accent' : 'bg-muted',
                      index === 0 ? (mode === 'gaming' ? 'border-2 border-primary shadow-[0_0_15px_var(--primary-hsl)]' : 'border-2 border-primary shadow-lg') : '',
                      index === 1 ? (mode === 'gaming' ? 'border-accent/70' : 'border-primary/70') : '',
                      index === 2 ? (mode === 'gaming' ? 'border-accent/50' : 'border-primary/50') : ''
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold w-6 text-center ${mode === 'gaming' ? (index < 3 ? 'text-primary' : 'text-foreground') : (index < 3 ? 'text-primary' : 'text-foreground')}`}>
                        {index + 1}
                      </span>
                      <Image 
                        src={contributor.avatarUrl || `https://placehold.co/40x40.png`} 
                        alt={`${contributor.username}'s avatar`}
                        data-ai-hint="person avatar"
                        width={40} 
                        height={40} 
                        className="rounded-full"
                      />
                      <span className={`font-medium ${mode === 'gaming' ? 'font-rajdhani' : ''}`}>
                        {contributor.username}
                      </span>
                    </div>
                    <div className={`text-lg font-bold ${mode === 'gaming' ? 'text-primary font-orbitron' : 'text-primary'}`}>
                      {contributor.promoPoints.toLocaleString()} PTS
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-6 border border-dashed rounded-lg text-center text-muted-foreground">
                Leaderboard is currently empty. Be the first to contribute!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

    