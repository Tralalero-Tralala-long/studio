
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import Image from 'next/image';
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, LogIn, UserCircle, Mail, Lock, Bell, Smartphone, BellOff } from 'lucide-react';
import { useAppContext } from "@/contexts/AppContext";

const allowedEmailDomains = [
  "@gmail.com",
  "@yahoo.com",
  "@yahoo.co.in",
  "@ymail.com",
  "@rocketmail.com",
  "@outlook.com",
  "@outlook.in",
  "@live.com",
  "@hotmail.com",
  "@msn.com",
  "@icloud.com",
  "@me.com",
  "@mac.com",
  "@aol.com",
  "@zoho.com",
  "@zohomail.com",
  "@protonmail.com",
  "@gmx.com",
  "@gmx.net",
  "@rediffmail.com",
  "@sify.com",
  "@bsnl.in",
  "@airtelmail.in",
  "@mail.com",
  "@tutanota.com",
  "@fastmail.com",
  "@yandex.com",
  "@yandex.ru"
];

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." })
    .refine(email => allowedEmailDomains.some(domain => email.endsWith(domain)), {
      message: "Please use an email from a supported provider (e.g., Gmail, Outlook, Yahoo, etc.)."
    }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." }).optional(),
  notifications: z.enum(["none", "phone", "email", "both"], {
    required_error: "You need to select a notification type.",
  }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const { mode, setIsAuthenticated, setUsername, setEmail } = useAppContext();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      notifications: "email",
    },
  });

  function onSubmit(data: LoginFormValues) {
    console.log(data);
    setIsAuthenticated(true);
    setUsername(data.username || null);
    setEmail(data.email);
    // alert("Login form submitted (placeholder). Check console for data. Redirecting to home..."); // Consider removing alert for better UX
    router.push('/');
  }

  const buttonClass = mode === 'gaming' ? 'button-glow-gaming' : 'button-glow-normal';

  return (
    <>
      <Image
        src="https://placehold.co/1920x1080.png"
        alt="Doodle background"
        data-ai-hint="doodle animation"
        layout="fill"
        objectFit="cover"
        className="fixed inset-0 z-[-1] opacity-30 dark:opacity-20"
      />
      <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height,8rem))] py-12">
        <Card className={`w-full max-w-md shadow-2xl ${mode === 'gaming' ? 'border-primary' : ''} bg-background/90 dark:bg-background/80 backdrop-blur-sm`}>
          <CardHeader className="text-center">
            <Flame className={`mx-auto h-12 w-12 mb-4 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
            <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>Welcome to PromoPulse</CardTitle>
            <CardDescription className={`${mode === 'gaming' ? 'font-rajdhani' : ''}`}>Sign in or create an account to start saving!</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username (Optional)</FormLabel>
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
                <FormField
                  control={form.control}
                  name="notifications"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Notification Preferences</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          {[
                            { value: "none", label: "None", icon: <BellOff className="w-4 h-4 mr-2" /> },
                            { value: "phone", label: "Phone Only", icon: <Smartphone className="w-4 h-4 mr-2" /> },
                            { value: "email", label: "Email Only", icon: <Mail className="w-4 h-4 mr-2" /> },
                            { value: "both", label: "Both", icon: <Bell className="w-4 h-4 mr-2" /> },
                          ].map(option => (
                             <FormItem key={option.value} className={`flex items-center space-x-2 p-3 rounded-md border ${field.value === option.value ? (mode === 'gaming' ? 'border-primary bg-primary/10' : 'border-primary bg-primary/10') : 'border-border'}`}>
                              <FormControl>
                                <RadioGroupItem value={option.value} />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center cursor-pointer">
                                {option.icon} {option.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className={`w-full ${buttonClass} text-lg py-6`}>
                  <LogIn className="mr-2 h-5 w-5" /> Create Account / Sign In
                </Button>
              </form>
            </Form>
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
              <div className="mt-6 grid grid-cols-2 gap-4">
                <Button variant="outline" className={`w-full ${buttonClass}`}>
                  <svg className="mr-2 h-5 w-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.85l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/></svg>
                  Google
                </Button>
                 <Button variant="outline" className={`w-full ${buttonClass}`}>
                  <svg className="mr-2 h-5 w-5" role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>Apple</title><path d="M12 2.039c-1.893 0-3.476.732-4.663 2.121A5.027 5.027 0 006.03 3.923C4.66 3.923 3.37 4.887 2.507 6.144A10.787 10.787 0 000 11.947c0 2.965 1.414 5.937 4.176 7.901 1.13.804 2.454 1.229 3.779 1.229.972 0 1.845-.287 2.728-.89.883.603 1.756.89 2.728.89.883 0 1.977-.318 2.942-.952 2.014-1.327 3.087-3.212 3.158-3.285a.18.18 0 00-.137-.237c-.05-.012-.108 0-.15.036-.071.06-.972.773-2.62 1.958-.484-.06-.936-.216-1.357-.456-.42-.24-.84-.575-1.229-.983-.542-.575-.936-1.264-.936-2.05 0-.084.012-.18.024-.275a.175.175 0 00-.17-.191c-.084 0-.19.06-.288.18-.506.635-.84 1.462-.84 2.287 0 .863.276 1.756.804 2.507.9.9 2.149 1.357 3.371 1.357.883 0 1.68-.252 2.383-.735.787-.542 1.276-1.264 1.475-1.707.024-.071.036-.143.036-.203s-.012-.12-.036-.168c-1.487-2.77-1.076-6.219.983-8.139a4.97 4.97 0 001.003-1.218C20.76 6.307 20.927 3.5 19.15 1.46.175.175 0 0118.99.959c-.517.492-1.218 1.003-2.088 1.003-.735 0-1.345-.371-1.811-.92-.735-.804-1.655-1.264-2.82-1.264-.084 0-.18.012-.276.024a.172.172 0 00-.155.13c-.036.095-.012.203.048.288.468.623.735 1.394.735 2.155 0 .9-.323 1.732-.92 2.445-.66.787-1.624 1.184-2.654 1.184-1.12 0-2.028-.53-2.764-1.382-.036-.036-.084-.06-.13-.06s-.095.024-.13.06c-.013.012-.025.025-.037.038a4.957 4.957 0 01-1.774 1.039A4.925 4.925 0 0112 11.07c-.383 0-.767-.048-1.12-.143a.18.18 0 00-.19.155c-.013.06.012.13.06.18.216.18.407.395.563.647.228.371.323.787.323 1.206 0 .623-.204 1.276-.66 1.845-.506.635-1.229.971-2.05.971-.972 0-1.833-.468-2.445-1.206-.407-.517-.623-1.13-.623-1.756 0-.095.012-.19.036-.287a.172.172 0 00-.17-.191c-.084 0-.179.06-.276.18-.506.635-.828 1.475-.828 2.299 0 .875.276 1.756.804 2.519.9.9 2.149 1.357 3.37 1.357.67 0 1.308-.18 1.88-.529.06-.036.13-.024.18.024.048.036.07.095.07.155V2.039zM11.988 10.81c.036 0 .06 0 .084.012a2.89 2.89 0 002.027-.851 2.89 2.89 0 00.852-2.028 2.89 2.89 0 00-.852-2.027 2.89 2.89 0 00-2.027-.852 2.89 2.89 0 00-2.028.852 2.89 2.89 0 00-.851 2.027 2.89 2.89 0 00.851 2.028 2.89 2.89 0 002.028.851z"/></svg>
                  Apple
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            By signing up, you agree to our <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link>.
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

    