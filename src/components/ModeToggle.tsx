
"use client";

import { Moon, Sun } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ModeToggle() {
  const { mode, toggleMode } = useAppContext();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleMode}
            className={mode === 'gaming' ? 'button-glow-gaming border-primary hover:border-accent' : 'button-glow-normal'}
            aria-label={`Switch to ${mode === 'normal' ? 'Gaming' : 'Normal'} mode`}
          >
            {mode === 'normal' ? (
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Switch to {mode === 'normal' ? 'Gaming' : 'Normal'} Mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
