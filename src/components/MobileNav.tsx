
"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, type LucideIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

type NavLink = {
    href: string;
    label: string;
    icon: LucideIcon;
}

type MobileNavProps = {
    navLinks: NavLink[];
}

export function MobileNav({ navLinks }: MobileNavProps) {
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
