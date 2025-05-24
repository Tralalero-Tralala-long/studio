
"use client";

import { useAppContext, type PromoExample } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Copy, PlusCircle, CalendarDays, ArrowLeft, CheckSquare } from "lucide-react";
import Link from "next/link";
import { cn, isCodeExpired } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import AddCodeForm from "@/components/AddCodeForm";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const initialAmazonCodes: PromoExample[] = [
  { id: "amz1", title: "Save $5 on Books", code: "BOOKDEAL5", expiry: "2025-06-19", platform: "Amazon", category: "books", description: "Get $5 off on book purchases over $25.", isUsed: false },
  { id: "amz2", title: "10% Off Sitewide", code: "NOW", expiry: "2025-05-28", platform: "Amazon", category: "sitewide_offer", description: "Get 10% off sitewide.", isUsed: false },
  { id: "amz3", title: "Up to 70% Off Swarovski Jewellery", code: "N15", expiry: "2025-06-01", platform: "Amazon", category: "jewellery", description: "Up to 70% off Swarovski Elements Jewellery including pendants and earrings.", isUsed: false },
  { id: "amz4", title: "20% Off Grasim Brand Store", code: "B10", expiry: "N/A", platform: "Amazon", category: "fashion", description: "Get 20% off at the Grasim Brand Store, including shirts and trousers.", isUsed: false },
  { id: "amz5", title: "Additional 35% Off Shoes", code: "N15", expiry: "N/A", platform: "Amazon", category: "footwear", description: "Get an additional 35% off on shoes, including ASIAN Sneakers and Campus Shoes.", isUsed: false },
];

export default function AmazonCodesPage() {
  const { mode, isDeveloperMode } = useAppContext();
  const { toast } = useToast();
  const [codes, setCodes] = useState<PromoExample[]>(
    initialAmazonCodes
      .filter(c => !isCodeExpired(c.expiry))
      .map(c => ({ ...c, isUsed: c.isUsed || false }))
  );
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
      platform: "Amazon",
      category: "general_ecommerce",
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
      description: `"${newPromo.title}" has been successfully added to Amazon Codes.`,
    });
  };

  const handleToggleUsed = (itemId: string) => {
    setCodes(prevCodes =>
      prevCodes.map(code =>
        code.id === itemId ? { ...code, isUsed: !code.isUsed } : code
      )
    );
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
                    href="https://www.amazon.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Amazon
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
              Active promo codes for Amazon.
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
                    {item.expiry && item.expiry !== "Not specified" && item.expiry !== "N/A" && (
                      <div className={`flex items-center text-xs ${mode === 'gaming' ? 'text-muted-foreground/80 font-rajdhani' : 'text-muted-foreground/80'}`}>
                        <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                        <span>Expires: {item.expiry}</span>
                      </div>
                    )}
                     {item.expiry === "N/A" && (
                      <div className={`flex items-center text-xs ${mode === 'gaming' ? 'text-muted-foreground/80 font-rajdhani' : 'text-muted-foreground/80'}`}>
                        <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                        <span>Expires: Ongoing</span>
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
                No active Amazon codes found at the moment. Check back soon!
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
          formTitle="Add New Amazon Code"
        />
      )}
    </>
  );
}

    