
"use client";

import Link from 'next/link';
import { useAppContext } from '@/contexts/AppContext';
import ModeToggle from '@/components/ModeToggle';
import DealAlertsToggle from '@/components/DealAlertsToggle';
import MobileModeToggle from '@/components/MobileModeToggle'; // Import the new toggle
import { Button } from '@/components/ui/button';
import { Flame, Home, Ticket, UserCircle, Users, Search, MessageCircle, ScanLine, Code } from 'lucide-react';

export default function Header() {
  const { mode, isAuthenticated } = useAppContext();

  const navLinkClass = `text-sm font-medium transition-colors hover:text-primary ${mode === 'gaming' ? 'text-primary-foreground hover:text-accent' : 'text-foreground'}`;
  
  let profileLinkPath = "/login";
  let profileLinkText = "Login";
  if (isAuthenticated) {
    profileLinkPath = "/profile";
    profileLinkText = "Profile";
  }
  
  const profileAriaLabel = isAuthenticated ? "Profile" : "Login or Sign Up";

  return (
    <header className={`sticky top-0 z-50 w-full border-b ${mode === 'gaming' ? 'bg-background border-border' : 'bg-card border-border'} shadow-sm`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 md:mr-8">
          <Flame className={`h-7 w-7 ${mode === 'gaming' ? 'text-primary' : 'text-primary'}`} />
          <span className={`text-xl font-bold ${mode === 'gaming' ? 'text-primary-foreground font-orbitron' : 'text-foreground font-semibold'}`}>
            PromoPulse
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className={navLinkClass}>
            <Home className="inline-block w-4 h-4 mr-1" /> Home
          </Link>
          <Link href="/game-codes" className={navLinkClass}>
            <Code className="inline-block w-4 h-4 mr-1" /> Code Categories
          </Link>
          <Link href="/my-coupons" className={navLinkClass}>
            <Ticket className="inline-block w-4 h-4 mr-1" /> My Coupons
          </Link>
          <Link href="/chatbot" className={navLinkClass}>
            <MessageCircle className="inline-block w-4 h-4 mr-1" /> Chatbot
          </Link>
          <Link href="/top-contributors" className={navLinkClass}>
            <Users className="inline-block w-4 h-4 mr-1" /> Top Contributors
          </Link>
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <DealAlertsToggle />
          <ModeToggle />
          <MobileModeToggle /> {/* Add the new toggle here */}
          <Link href="/search">
            <Button
              variant="outline"
              size="icon"
              className={`${mode === 'gaming' ? 'button-glow-gaming border-primary hover:border-accent' : 'button-glow-normal border-input hover:border-primary'}`}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          {/* Chatbot icon button for smaller screens, if main nav is hidden */}
          <Link href="/chatbot" className="md:hidden">
            <Button
              variant="outline"
              size="icon"
              className={`${mode === 'gaming' ? 'button-glow-gaming border-primary hover:border-accent' : 'button-glow-normal border-input hover:border-primary'}`}
              aria-label="Chatbot"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          </Link>
          <Link href={profileLinkPath}>
            <Button 
              variant="outline" 
              size="icon" 
              className={`${mode === 'gaming' ? 'button-glow-gaming border-primary hover:border-accent' : 'button-glow-normal border-input hover:border-primary'}`}
              aria-label={profileAriaLabel}
            >
              <UserCircle className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
