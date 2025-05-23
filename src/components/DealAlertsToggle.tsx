
"use client";

import { Bell, BellOff } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function DealAlertsToggle() {
  const { dealAlerts, setDealAlerts, mode } = useAppContext();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2">
            {dealAlerts ? <Bell className={`h-5 w-5 ${mode === 'gaming' ? 'text-accent' : 'text-primary'}`} /> : <BellOff className="h-5 w-5 text-muted-foreground" />}
            <Switch
              id="deal-alerts-toggle"
              checked={dealAlerts}
              onCheckedChange={setDealAlerts}
              aria-label="Toggle Deal Alerts"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{dealAlerts ? 'Disable' : 'Enable'} Deal Alerts</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
