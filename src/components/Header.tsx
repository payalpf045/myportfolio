
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, Contrast, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileNav } from './MobileNav';


const navLinks = [
    { href: '/', label: 'Projects', icon: Home },
    { href: '/films', label: 'Film', icon: Film },
    { href: '/color-grading', label: 'Color Grading', icon: Contrast },
    { href: '/photography', label: 'Photography', icon: Camera },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-white/5 sticky top-0 z-40">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        
        <div className="flex items-center gap-4 md:flex-1">
           <MobileNav navLinks={navLinks} />
           <Link href="/" className="flex items-center" aria-label="Home">
                <span className="text-xl md:text-2xl tracking-wider uppercase font-headline font-medium">
                PAYAL
                </span>
            </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-8 text-sm font-medium">
            {navLinks.map(({href, label, icon: Icon}) => (
                <Link
                    key={href}
                    href={href}
                    className={cn(
                        "transition-colors hover:text-foreground flex items-center gap-2",
                        pathname === href ? "text-foreground" : "text-muted-foreground"
                    )}
                >
                    <Icon className="h-4 w-4" />
                    {label}
                </Link>
            ))}
        </nav>
        
        <div className="hidden md:flex flex-1" />

      </div>
    </header>
  );
}
