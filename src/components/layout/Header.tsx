
"use client";

import Link from 'next/link';
import { useAppContext } from '@/contexts/AppContext';
import ModeToggle from '@/components/ModeToggle';
import DealAlertsToggle from '@/components/DealAlertsToggle';
import { Button } from '@/components/ui/button';
import { Flame, Home, Scan, Ticket, UserCircle, User, Users } from 'lucide-react'; // Added Users icon

export default function Header() {
  const { mode } = useAppContext();

  const navLinkClass = `text-sm font-medium transition-colors hover:text-primary ${mode === 'gaming' ? 'text-primary-foreground hover:text-accent' : 'text-foreground'}`;

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
          <Link href="/#scan" className={navLinkClass}> {/* Assuming Scan is a section on home page for now */}
            <Scan className="inline-block w-4 h-4 mr-1" /> Scan
          </Link>
          <Link href="/my-coupons" className={navLinkClass}>
            <Ticket className="inline-block w-4 h-4 mr-1" /> My Coupons
          </Link>
          <Link href="/login" className={navLinkClass}> 
            <User className="inline-block w-4 h-4 mr-1" /> Profile
          </Link>
          <Link href="/top-contributors" className={navLinkClass}>
            <Users className="inline-block w-4 h-4 mr-1" /> Top Contributors
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          <DealAlertsToggle />
          <ModeToggle />
          <Link href="/login">
            <Button 
              variant="outline" 
              size="icon" 
              className={`${mode === 'gaming' ? 'button-glow-gaming border-primary hover:border-accent' : 'button-glow-normal border-input hover:border-primary'}`}
            >
              <UserCircle className="h-5 w-5" />
              <span className="sr-only">Login</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

// Placeholder pages for navigation items
export function MyCouponsPage() {
  return <div className="container mx-auto p-4"><h1 className="text-2xl font-bold">My Coupons</h1><p>Your saved coupons will appear here.</p></div>;
}

export function ProfilePage() {
  return <div className="container mx-auto p-4"><h1 className="text-2xl font-bold">Profile</h1><p>User profile settings will be here.</p></div>;
}
