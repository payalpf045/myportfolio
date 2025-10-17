
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, Contrast, Camera, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from 'react';


const navLinks = [
    { href: '/', label: 'Projects', icon: Home },
    { href: '/films', label: 'Film', icon: Film },
    { href: '/color-grading', label: 'Color Grading', icon: Contrast },
    { href: '/photography', label: 'Photography', icon: Camera },
];

function MobileNav() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  if (!isMounted) {
    return (
        <div className="md:hidden">
            <Button variant="ghost" size="icon" disabled>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
            </Button>
        </div>
    );
  }

  return (
    <div className="md:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] p-0">
                <div className="p-6 h-full flex flex-col">
                    <Link href="/" className="flex items-center gap-3 mb-8" aria-label="Home">
                        <span className="text-2xl tracking-wider uppercase font-headline font-medium">
                        PAYAL
                        </span>
                    </Link>
                    <nav className="flex flex-col items-start gap-4 text-lg font-medium">
                        {navLinks.map(({href, label, icon: Icon}) => (
                                <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "transition-colors hover:text-foreground w-full py-2 flex items-center gap-3",
                                    pathname === href ? "text-foreground font-semibold" : "text-muted-foreground"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    </div>
  );
}


export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-white/5 sticky top-0 z-40">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        
        <div className="flex items-center gap-4 md:flex-1">
           <MobileNav />
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
