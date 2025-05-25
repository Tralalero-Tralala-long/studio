
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, LogIn, UserCircle, Mail, Lock } from 'lucide-react';
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import DealAlertsToggle from "@/components/DealAlertsToggle";
import { Label } from "@/components/ui/label";

// Developer credentials
const DEV_USERNAME = "therealdev0025";
const DEV_EMAIL = "virajdatla0204@gmail.com";
const DEV_PASSWORD = "123456789";


const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const { mode, setIsAuthenticated, setUsername, setEmail, setIsDeveloperMode, setUser, dealAlerts, setDealAlerts } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const handleLocalAuthSuccess = (
    email: string, 
    username: string, 
    isDev: boolean
  ) => {
    const mockUser = {
      uid: 'localUser_' + Date.now(), // Simple unique ID for local user
      email: email,
      displayName: username,
    };
    
    setUser(mockUser); // Update AppContext with mock user
    setIsAuthenticated(true, mockUser); // Set authenticated state and pass user data
    setUsername(username); // Redundant if setIsAuthenticated passes user, but kept for explicitness
    setEmail(email); // Redundant if setIsAuthenticated passes user
    setIsDeveloperMode(isDev);

    toast({
      title: isDev ? "Developer Mode Activated" : "Sign-In Successful!",
      description: `Welcome, ${username}! Redirecting...`,
    });
    router.push('/');
  };

  async function onSubmit(data: LoginFormValues) {
    if (data.email === DEV_EMAIL && data.password === DEV_PASSWORD && data.username === DEV_USERNAME) {
      // Developer login
      handleLocalAuthSuccess(data.email, data.username, true);
    } else {
      // Regular user login/signup simulation
      // For this local-only version, we'll assume any other valid submission is a successful "login"
      // or "account creation". No actual password check is performed beyond schema validation.
      handleLocalAuthSuccess(data.email, data.username, false);
    }
  }

  const buttonClass = mode === 'gaming' ? 'button-glow-gaming' : 'button-glow-normal';

  return (
    <>
      <div className="fixed inset-0 z-[-2] overflow-hidden">
         <Image
            src="https://user-images.githubusercontent.com/14080295/291889848-a76a0235-f557-4f5d-821e-5c265557ac61.png"
            alt="Brand logos background"
            data-ai-hint="brand logos"
            layout="fill"
            objectFit="cover"
            priority
          />
      </div>
      <div className="fixed inset-0 z-[-1] bg-black/50 dark:bg-black/70"></div>

      <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height,8rem))] py-12 px-4">
        <Card className={`w-full max-w-md shadow-2xl ${mode === 'gaming' ? 'border-primary' : ''} bg-background/90 dark:bg-background/80 backdrop-blur-sm`}>
          <CardHeader className="text-center">
            <Flame className={`mx-auto h-12 w-12 mb-4 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
            <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>Welcome to PromoPulse</CardTitle>
            <CardDescription className={`${mode === 'gaming' ? 'font-rajdhani' : ''}`}>
              Sign in or create an account to start saving!
              (Dev: {DEV_USERNAME}/{DEV_EMAIL}/{DEV_PASSWORD})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="Your awesome username" {...field} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input type="email" placeholder="your.email@example.com" {...field} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-between space-y-0 pt-2">
                  <Label htmlFor="deal-alerts-login-page" className="text-base">Deal Alerts</Label>
                  <DealAlertsToggle />
                </div>
                
                <Button type="submit" className={`w-full ${buttonClass} text-lg py-6`}>
                  <LogIn className="mr-2 h-5 w-5" /> Create Account / Sign In
                </Button>
              </form>
            </Form>
            {/* Social logins removed as per Firebase-independent requirement */}
            {/* 
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className={`px-2 bg-background text-muted-foreground`}>
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4"> 
                 Button for Google removed
              </div>
            </div>
            */}
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            By signing up, you agree to our <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link>.
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
