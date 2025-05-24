
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAppContext, type PromoExample } from "@/contexts/AppContext";
import { PlusCircle, ArrowLeft, CalendarIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const addCodeFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  platform: z.string().min(2, { message: "Platform/Game name is required." }),
  code: z.string().min(1, { message: "Promo code is required." }),
  expiry: z.date().optional(), // Making expiry date optional
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  category: z.string().optional(), // Optional category field
});

type AddCodeFormValues = z.infer<typeof addCodeFormSchema>;

export default function AddCodePage() {
  const { mode, addPromoExample, isDeveloperMode, isAuthenticated } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const prefilledPlatform = searchParams.get('platform') || '';
  const prefilledMode = searchParams.get('mode') as 'normal' | 'gaming' | null || mode;

  const form = useForm<AddCodeFormValues>({
    resolver: zodResolver(addCodeFormSchema),
    defaultValues: {
      title: "",
      platform: prefilledPlatform,
      code: "",
      expiry: undefined,
      description: "",
      category: prefilledMode === 'gaming' ? 'game_code' : 'e-commerce_discount', // Default category based on mode
    },
  });

  useEffect(() => {
    // Redirect if not a developer or not authenticated
    if (!isAuthenticated || !isDeveloperMode) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        variant: "destructive",
      });
      router.push('/');
    }
  }, [isAuthenticated, isDeveloperMode, router, toast]);


  function onSubmit(data: AddCodeFormValues) {
    const newPromo: Omit<PromoExample, 'id'> = {
      title: data.title,
      code: data.code,
      platform: data.platform,
      expiry: data.expiry ? format(data.expiry, "yyyy-MM-dd") : "N/A",
      description: data.description,
      category: data.category || (mode === 'gaming' ? 'game_code' : undefined),
      game: mode === 'gaming' ? data.platform : undefined, // If gaming mode, platform is the game name
    };
    addPromoExample(newPromo);
    toast({
      title: "Code Added!",
      description: `"${data.title}" has been successfully added.`,
    });
    router.push('/'); // Redirect to homepage after adding
  }
  
  if (!isAuthenticated || !isDeveloperMode) {
    // Render minimal content or null while redirecting
    return <div className="container mx-auto p-4 md:p-8 text-center">Redirecting...</div>;
  }

  const platformFieldLabel = prefilledMode === 'gaming' ? "Game Name" : "Site/Platform Name";

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className={`${mode === 'gaming' ? 'bg-card border-primary' : 'bg-card'} shadow-lg`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlusCircle className={`w-8 h-8 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
              <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
                Add New Promo Code
              </CardTitle>
            </div>
            <Link href="/" passHref>
              <Button 
                variant="outline" 
                className={cn(
                  mode === 'gaming' ? 'button-glow-gaming hover:border-accent' : 'button-glow-normal hover:border-primary'
                )}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          <CardDescription className={`${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'} pt-2`}>
            Fill in the details below to add a new promotional code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 20% Off Summer Sale" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{platformFieldLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder={prefilledMode === 'gaming' ? "e.g., Roblox Codes, Steam" : "e.g., E-commerce, Delivery"} {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the platform or game this code is for (e.g., E-commerce, Delivery, Roblox Codes, Steam).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promo Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., SUMMER20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiry"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiry Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setDate(new Date().getDate() -1)) // Disable past dates
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the promo code, its benefits, and any conditions."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., game_code, discount, free_shipping" {...field} />
                    </FormControl>
                     <FormDescription>
                      An optional internal category for the code.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className={`w-full ${mode === 'gaming' ? 'button-glow-gaming' : 'button-glow-normal'} text-lg py-6`}>
                <PlusCircle className="mr-2 h-5 w-5" /> Add Promo Code
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

