import Link from 'next/link';
import { Camera } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="bg-transparent backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Home">
          <span className="font-headline text-2xl font-black tracking-tight">
            JD
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/photography"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Photography
          </Link>
          <Link
            href="/films"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Films
          </Link>
          <Link
            href="/color-grading"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Color Grading
          </Link>
           <Link
            href="/admin"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Admin
          </Link>
        </nav>
        <Button asChild>
            <Link href="mailto:contact@johndoe.com">Contact Me</Link>
        </Button>
      </div>
    </header>
  );
}
