
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
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
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
                  <Image
                    src="https://th.bing.com/th/id/R.4e94e3f54fbb6f6f80763b9bd5fdb903?rik=%2b7FChRw20j9Agw&riu=http%3a%2f%2fwww.pngmart.com%2ffiles%2f1%2fApple-Logo-Transparent-PNG.png&ehk=sMvjGoUnOoGys47uqPXJ9Aliq5BQYZASmMcUKWYiRTg%3d&risl=&pid=ImgRaw&r=0"
                    alt="Apple logo"
                    width={20}
                    height={20}
                    className="mr-2 h-5 w-5"
                  />
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
