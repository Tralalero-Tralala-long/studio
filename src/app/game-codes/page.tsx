
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift } from "lucide-react";

export default function GameCodesPage() {
  const { mode } = useAppContext();
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className={`${mode === 'gaming' ? 'bg-card border-primary' : 'bg-card'}`}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Gift className={`w-8 h-8 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
            <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
              Game Codes
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className={`text-lg ${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'}`}>
            Discover and manage your game codes here. Keep an eye out for new additions!
          </p>
          {/* Placeholder for game code list, filtering, or search functionality */}
          <div className="mt-6 p-6 border border-dashed rounded-lg text-center text-muted-foreground">
            Game codes will be listed here. This section can be used to display various game codes, perhaps with search and filter options in the future.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
