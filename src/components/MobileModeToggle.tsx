
"use client";

import { Smartphone, Monitor, Settings2 } from 'lucide-react';
import { useAppContext, type ManualMobileModeOverride } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function MobileModeToggle() {
  const { manualMobileModeOverride, setManualMobileModeOverride, mode } = useAppContext();

  const toggleManualMobileMode = () => {
    let nextMode: ManualMobileModeOverride;
    if (manualMobileModeOverride === 'auto') {
      nextMode = 'on';
    } else if (manualMobileModeOverride === 'on') {
      nextMode = 'off';
    } else { // 'off'
      nextMode = 'auto';
    }
    setManualMobileModeOverride(nextMode);
  };

  let Icon = Settings2;
  let label = "Mobile View: Auto";
  if (manualMobileModeOverride === 'on') {
    Icon = Smartphone;
    label = "Mobile View: On (Forced)";
  } else if (manualMobileModeOverride === 'off') {
    Icon = Monitor;
    label = "Mobile View: Off (Forced Desktop)";
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleManualMobileMode}
            className={mode === 'gaming' ? 'button-glow-gaming border-primary hover:border-accent' : 'button-glow-normal'}
            aria-label={`Toggle Mobile View Mode. Current: ${label}`}
          >
            <Icon className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
