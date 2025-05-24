
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { auth } from '@/lib/firebase/config'; // Added Firebase auth import

export default function ProfilePage() {
  const { mode, username, email, signOut, isAuthenticated } = useAppContext(); // Added isAuthenticated
  const router = useRouter();
  const { toast } = useToast();
  
  // Local state for inputs, primarily for display. Direct editing not fully supported without backend.
  const [currentUsername, setCurrentUsername] = useState(username || "");
  const [currentEmail, setCurrentEmail] = useState(email || "");

  useEffect(() => {
    // If not authenticated, redirect to login. This is an extra layer of protection.
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setCurrentUsername(username || "User");
    setCurrentEmail(email || "user@example.com");
  }, [username, email, isAuthenticated, router]);


  const handleSignOutClick = async () => {
    await signOut();
    // The AppContext's onAuthStateChanged listener should handle redirecting
    // or clearing user data. If direct redirect is needed after sign out:
    router.push('/login'); 
  };

  // If not authenticated and useEffect hasn't redirected yet, show loading or nothing
  if (!isAuthenticated) {
      return (
        <div className="container mx-auto p-4 md:p-8 text-center">
          <p>Loading profile or redirecting...</p>
        </div>
      );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className={`${mode === 'gaming' ? 'bg-card border-primary' : 'bg-card'} shadow-lg`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className={`w-8 h-8 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
            <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
              User Profile
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              {/* Placeholder for user's actual avatar if available from Firebase (user.photoURL) */}
              <AvatarImage src={auth.currentUser?.photoURL || "https://placehold.co/100x100.png"} alt="User Avatar" data-ai-hint="person avatar"/>
              <AvatarFallback>{currentUsername ? currentUsername.substring(0, 2).toUpperCase() : "UP"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className={`text-xl font-semibold ${mode === 'gaming' ? 'font-rajdhani' : ''}`}>{currentUsername}</h3>
              <p className="text-sm text-muted-foreground">{currentEmail}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              value={currentUsername} 
              // onChange={(e) => setCurrentUsername(e.target.value)} // Not for direct update without backend
              className={`${mode === 'gaming' ? 'bg-input border-border' : ''}`} 
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={currentEmail} 
              // onChange={(e) => setCurrentEmail(e.target.value)} // Not for direct update without backend
              className={`${mode === 'gaming' ? 'bg-input border-border' : ''}`} 
              readOnly
            />
          </div>
          
          <Button 
            onClick={handleSignOutClick} 
            variant="outline" 
            className={`w-full mt-4 ${mode === 'gaming' ? 'button-glow-gaming border-destructive hover:border-red-400' : 'button-glow-normal hover:border-destructive hover:text-destructive dark:hover:text-destructive'}`}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
