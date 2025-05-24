
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

export default function ProfilePage() {
  const { mode, username, email, signOut } = useAppContext();
  const router = useRouter();
  
  const [currentUsername, setCurrentUsername] = useState(username || "PromoUser123");
  const [currentEmail, setCurrentEmail] = useState(email || "promouser@example.com");

  useEffect(() => {
    setCurrentUsername(username || "PromoUser123");
    setCurrentEmail(email || "promouser@example.com");
  }, [username, email]);

  const handleSignOutClick = () => {
    signOut();
    router.push('/login');
  };

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
              <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="person avatar"/>
              <AvatarFallback>{currentUsername ? currentUsername.substring(0, 2).toUpperCase() : "UP"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className={`text-xl font-semibold ${mode === 'gaming' ? 'font-rajdhani' : ''}`}>{currentUsername || "Not set"}</h3>
              <p className="text-sm text-muted-foreground">{currentEmail || "Not set"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              value={currentUsername} 
              onChange={(e) => setCurrentUsername(e.target.value)}
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
              onChange={(e) => setCurrentEmail(e.target.value)}
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
