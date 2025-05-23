
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User }ika_ai="User icon" />
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { mode } = useAppContext();
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className={`${mode === 'gaming' ? 'bg-card border-primary' : 'bg-card'}`}>
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
              <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="person avatar" />
              <AvatarFallback>UP</AvatarFallback>
            </Avatar>
            <div>
              <h3 className={`text-xl font-semibold ${mode === 'gaming' ? 'font-rajdhani' : ''}`}>PromoUser123</h3>
              <p className="text-sm text-muted-foreground">promouser@example.com</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue="PromoUser123" className={`${mode === 'gaming' ? 'bg-input border-border' : ''}`} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="promouser@example.com" className={`${mode === 'gaming' ? 'bg-input border-border' : ''}`} />
          </div>
          
          {/* More profile settings can be added here */}
          <Button className={`${mode === 'gaming' ? 'button-glow-gaming' : 'button-glow-normal'} w-full md:w-auto`}>
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
