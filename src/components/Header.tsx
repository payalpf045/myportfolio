"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from './ui/button';
import { cn } from '@/lib/utils';


const navLinks = [
    { href: '/', label: 'Projects' },
    { href: '/films', label: 'Film' },
    { href: '/color-grading', label: 'Color Grading' },
    { href: '/photography', label: 'Photography' },
];

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-white/5 sticky top-0 z-40">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        
        <div className="flex items-center gap-4">
           <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px]">
                    <div className="p-6 h-full flex flex-col">
                        <Link href="/" className="flex items-center gap-3 mb-8" aria-label="Home">
                            <span className="text-2xl tracking-wider uppercase font-headline">
                            PAYAL
                            </span>
                        </Link>
                        <nav className="flex flex-col items-start gap-6 text-lg font-medium">
                            {navLinks.map(({href, label}) => (
                                 <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        "transition-colors hover:text-foreground w-full py-2",
                                        pathname === href ? "text-foreground font-semibold" : "text-muted-foreground"
                                    )}
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
             <Link href="/" className="flex items-center" aria-label="Home">
                <span className="text-xl md:text-2xl tracking-wider uppercase font-headline">
                PAYAL
                </span>
            </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map(({href, label}) => (
                <Link
                    key={href}
                    href={href}
                    className={cn(
                        "transition-colors hover:text-foreground",
                        pathname === href ? "text-foreground" : "text-muted-foreground"
                    )}
                >
                    {label}
                </Link>
            ))}
        </nav>

      </div>
    </header>
  );
}
