
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react"; // Renamed to avoid conflict

export default function SearchPage() {
  const { mode } = useAppContext();
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className={`${mode === 'gaming' ? 'bg-card border-primary' : 'bg-card'}`}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <SearchIcon className={`w-8 h-8 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
            <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
              Search Promo Codes
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className={`text-lg ${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'}`}>
            Use the search bar below to find specific promo codes, platforms, or games.
          </p>
          <div className="flex w-full max-w-xl items-center space-x-2 mx-auto">
            <Input 
              type="text" 
              placeholder="Enter keywords like 'Steam', '20% off', 'Roblox gems'..." 
              className={`${mode === 'gaming' ? 'bg-input border-border focus:border-primary' : 'focus:border-primary'}`} 
            />
            <Button type="submit" className={`${mode === 'gaming' ? 'button-glow-gaming' : 'button-glow-normal'}`}>
              <SearchIcon className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
          {/* Placeholder for search results */}
          <div className="mt-8 p-6 border border-dashed rounded-lg text-center text-muted-foreground">
            Search results will appear here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
