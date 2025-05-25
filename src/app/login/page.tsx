
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
import { auth } from '@/lib/firebase/config';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, type User as FirebaseUser } from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";
import DealAlertsToggle from "@/components/DealAlertsToggle";
import { Label } from "@/components/ui/label";

// Email domain validation removed as per user request

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

  const checkFirebaseConfig = () => {
    if (!auth || !auth.app || !auth.app.options || auth.app.options.apiKey === "YOUR_API_KEY" || auth.app.options.apiKey === "") {
      toast({
        title: "Firebase Configuration Error",
        description: "Please ensure Firebase is configured with your project's credentials in src/lib/firebase/config.ts. The API key should not be 'YOUR_API_KEY'.",
        variant: "destructive",
        duration: 10000,
      });
      return false;
    }
    return true;
  };

  const handleFirebaseAuthSuccess = (firebaseUser: FirebaseUser, isNewUser: boolean = false, formUsername?: string) => {
    setUser(firebaseUser);
    setIsAuthenticated(true);
    const displayName = formUsername || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User";
    const userEmail = firebaseUser.email; 
    
    setEmail(userEmail); 
    setUsername(displayName);

    if (userEmail === "virajdatla0204@gmail.com") {
      setIsDeveloperMode(true);
      toast({
        title: "Developer Mode Activated",
        description: `Welcome, Developer ${displayName}! Redirecting...`,
      });
    } else {
      setIsDeveloperMode(false);
      toast({
        title: isNewUser ? "Account Created!" : "Sign-In Successful!",
        description: `Welcome, ${displayName}! Redirecting...`,
      });
    }

    if (isNewUser && formUsername && firebaseUser.displayName !== formUsername) {
      updateProfile(firebaseUser, { displayName: formUsername })
        .then(() => {
            if (auth.currentUser && auth.currentUser.displayName) {
                setUsername(auth.currentUser.displayName); 
            }
        })
        .catch(err => console.error("Error updating Firebase profile:", err));
    } else if (!isNewUser && formUsername && firebaseUser.displayName !== formUsername) {
       updateProfile(firebaseUser, { displayName: formUsername })
        .then(() => {
            if (auth.currentUser && auth.currentUser.displayName) {
                setUsername(auth.currentUser.displayName);
            }
        })
        .catch(err => console.error("Error updating Firebase profile on sign-in:", err));
    }

    router.push('/');
  };

  const handleFirebaseAuthError = (error: any, providerName: string) => {
    console.error(`${providerName} Sign-In/Up Error:`, error);
    let description = "An unknown error occurred. Please try again.";
    if (error.code) {
        switch (error.code) {
            case 'auth/popup-closed-by-user':
            case 'auth/cancelled-popup-request':
                description = "Sign-in process was cancelled.";
                break;
            case 'auth/email-already-in-use':
                description = "This email is already in use. Try signing in or use a different email.";
                break;
            case 'auth/weak-password':
                description = "Password is too weak. Please choose a stronger password.";
                break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                 description = "Invalid email or password. Please try again.";
                 break;
            case 'auth/api-key-not-valid':
                description = "Firebase API Key is not valid. Please check your Firebase project configuration in src/lib/firebase/config.ts.";
                break;
            case 'auth/configuration-not-found':
                description = `The ${providerName} sign-in method is not enabled. Please enable it in your Firebase project's Authentication settings. For Email/Password, ensure it's enabled. For Google/Apple, ensure they are enabled and correctly configured.`;
                break;
            default:
                description = error.message || description;
        }
    }
    toast({
      title: `${providerName} ${error.code === 'auth/email-already-in-use' ? 'Sign-Up' : 'Sign-In'} Failed`,
      description: description,
      variant: "destructive",
    });
  };


  async function onSubmit(data: LoginFormValues) {
    if (!checkFirebaseConfig()) return;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      handleFirebaseAuthSuccess(userCredential.user, false, data.username); 
    } catch (signInError: any) {
      if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/wrong-password' || signInError.code === 'auth/invalid-credential') {
        try {
          const newUserCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
          await updateProfile(newUserCredential.user, { displayName: data.username });
           handleFirebaseAuthSuccess(newUserCredential.user, true, data.username);
        } catch (signUpError: any) {
          handleFirebaseAuthError(signUpError, "Email/Password (Sign-Up)");
        }
      } else {
        handleFirebaseAuthError(signInError, "Email/Password (Sign-In)");
      }
    }
  }


  const handleGoogleSignIn = async () => {
    if (!checkFirebaseConfig()) return;

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      handleFirebaseAuthSuccess(result.user);
    } catch (error) {
      handleFirebaseAuthError(error, "Google");
    }
  };

  const buttonClass = mode === 'gaming' ? 'button-glow-gaming' : 'button-glow-normal';

  return (
    <>
      <div className="fixed inset-0 z-[-2] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline 
          className="absolute top-1/2 left-1/2 w-auto min-w-full min-h-full max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source src="/videos/login-background.mp4" type="video/mp4" />
          Your browser does not support the video tag. Please place your video at public/videos/login-background.mp4
        </video>
      </div>
      <div className="fixed inset-0 z-[-1] bg-black/50 dark:bg-black/70"></div>

      <div className="flex items-center justify-center min-h-[calc(100vh-var(--header-height,8rem))] py-12 px-4">
        <Card className={`w-full max-w-md shadow-2xl ${mode === 'gaming' ? 'border-primary' : ''} bg-background/90 dark:bg-background/80 backdrop-blur-sm`}>
          <CardHeader className="text-center">
            <Flame className={`mx-auto h-12 w-12 mb-4 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
            <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>Welcome to PromoPulse</CardTitle>
            <CardDescription className={`${mode === 'gaming' ? 'font-rajdhani' : ''}`}>
              Sign in or create an account to start saving!
              (Dev Email: virajdatla0204@gmail.com / User: therealdev0025 / Pwd: 123456789)
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
                <Button variant="outline" className={`w-full ${buttonClass}`} onClick={handleGoogleSignIn}>
                  <svg className="mr-2 h-5 w-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.85l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/></svg>
                  Google
                </Button>
                {/* Apple Sign In Button Removed */}
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
