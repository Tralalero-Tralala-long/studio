
"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function TopContributorsPage() {
  const { mode } = useAppContext();
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className={`${mode === 'gaming' ? 'bg-card border-primary' : 'bg-card'}`}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className={`w-8 h-8 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
            <CardTitle className={`text-3xl font-bold ${mode === 'gaming' ? 'font-orbitron' : ''}`}>
              Top Contributors
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className={`text-lg ${mode === 'gaming' ? 'text-muted-foreground font-rajdhani' : 'text-muted-foreground'}`}>
            This page will showcase our top contributors. Check back soon for updates!
          </p>
          {/* Placeholder for contributor list */}
          <div className="mt-6 p-6 border border-dashed rounded-lg text-center text-muted-foreground">
            Leaderboard coming soon!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
