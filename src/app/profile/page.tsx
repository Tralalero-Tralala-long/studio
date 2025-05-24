
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Removed Button import as it's no longer used for "Update Profile"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { mode, username, email } = useAppContext();
  
  // Use local state for input fields to allow editing, initialized from context
  const [currentUsername, setCurrentUsername] = useState(username || "PromoUser123");
  const [currentEmail, setCurrentEmail] = useState(email || "promouser@example.com");

  useEffect(() => {
    // Update local state if context changes (e.g., after login)
    setCurrentUsername(username || "PromoUser123");
    setCurrentEmail(email || "promouser@example.com");
  }, [username, email]);

  // Removed handleUpdateProfile function as the button is removed

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
              readOnly // If profile updates are removed, consider making fields read-only
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
              readOnly // If profile updates are removed, consider making fields read-only
            />
          </div>
          
          {/* More profile settings can be added here, e.g., change password, notification preferences */}
          
          {/* Update Profile Button Removed */}
        </CardContent>
      </Card>
    </div>
  );
}
