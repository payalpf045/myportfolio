import Link from 'next/link';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-white/5 sticky top-0 z-40">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Home">
          <span className="text-2xl font-bold tracking-wider uppercase">
            PAYAL
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Projects
          </Link>
          <Link
            href="/films"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Film
          </Link>
          <Link
            href="/color-grading"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Color Grading
          </Link>
           <Link
            href="/photography"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Photography
          </Link>
        </nav>
      </div>
    </header>
  );
}
