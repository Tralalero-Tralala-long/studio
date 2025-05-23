
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

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." }).optional(),
  notifications: z.enum(["none", "phone", "email", "both"], {
    required_error: "You need to select a notification type.",
  }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const { mode, setIsAuthenticated } = useAppContext();
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
    // Placeholder for Firebase Auth
    console.log(data);
    setIsAuthenticated(true); // Set authenticated state
    alert("Login form submitted (placeholder). Check console for data. Redirecting to home...");
    router.push('/'); // Redirect to homepage
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
                  <svg className="mr-2 h-5 w-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Apple</title><path d="M12.02_9.63c.08-.44.14-.87.14-1.29_0-.53-.07-1.05-.17-1.55H6.23c-.1.4-.16.8-.16_1.2_0_.36.04.71.1_1.05h5.81zm0-3.48A5.07_5.07_0_0_0_12_6c-.56_0-1.1.1-1.6.28_0_0_0_0_0_0h3.2c.1-.44.15-.88.15-1.32a3.2_3.2_0_0_0-.73-2.03zm-6.25_5.03A4.36_4.36_0_0_1_2.04_8.1a4.34_4.34_0_0_1_2.73-1.31_4.64_4.64_0_0_0_.91-2.93c.76-1.38_2.13-2.3_3.68-2.31a5.2_5.2_0_0_0_4.23_2.43_4.58_4.58_0_0_1_2.52-3.19_4.5_4.5_0_0_1-1.79-4.12A4.11_4.11_0_0_1_9.92_0a4.54_4.54_0_0_1-3.42.68_4.3_4.3_0_0_0-3.31.32_4.38_4.38_0_0_0-2.62-1.32A4.47_4.47_0_0_1_0_4.82_6.94_6.94_0_0_0_3.27_10c0_2.37_1.22_4.22_3.13_5.28a4.36_4.36_0_0_1_2.73_1.31_4.64_4.64_0_0_0_.91_2.93c.76_1.38_2.13_2.3_3.68_2.31a5.2_5.2_0_0_0_4.23-2.43_4.58_4.58_0_0_1_2.52_3.19_4.5_4.5_0_0_1-1.79_4.12_4.11_4.11_0_0_1-2.53_1.31_4.54_4.54_0_0_1-3.42-.68_4.3_4.3_0_0_0-3.31-.32_4.38_4.38_0_0_0-2.62_1.32_4.47_4.47_0_0_1-4.15-1.55C.65_17.23_0_14.78_0_12.28_0_11.01.2_9.8.57_8.66h5.2zM18.86_15.28A4.36_4.36_0_0_1_15.12_20a4.34_4.34_0_0_1-2.73-1.31_4.64_4.64_0_0_0-.91-2.93c-.76-1.38-2.13-2.3-3.68-2.31a5.2_5.2_0_0_0-4.23_2.43_4.58_4.58_0_0_1-2.52-3.19_4.5_4.5_0_0_1_1.79-4.12A4.11_4.11_0_0_1_5.36_8a4.54_4.54_0_0_1_3.42.68_4.3_4.3_0_0_0_3.31.32_4.38_4.38_0_0_0_2.62-1.32_4.47_4.47_0_0_1_4.15_1.55C19.53_11.34_19.53_13.79_18.86_15.28ZM13.81_4.46A3.67_3.67_0_0_0_12_3.55a3.53_3.53_0_0_0-1.79.9_3.4_3.4_0_0_0-1.11_2.58_3.44_3.44_0_0_0_1.11_2.59_3.55_3.55_0_0_0_3.58_0A3.43_3.43_0_0_0_15_7_3.47_3.47_0_0_0_13.81_4.46Z"/></svg>
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
