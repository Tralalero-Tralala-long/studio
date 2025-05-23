
"use client";

import { ShoppingCart, Gamepad2 } from 'lucide-react'; // Updated icons
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
              <ShoppingCart className="h-[1.2rem] w-[1.2rem]" /> // ShoppingCart icon
            ) : (
              <Gamepad2 className="h-[1.2rem] w-[1.2rem]" /> // Gamepad2 icon
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
