import Link from 'next/link';
import { Camera } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="PhotoFlow Home">
          <Camera className="h-6 w-6 text-primary" />
          <span className="font-headline text-2xl font-bold text-primary">
            PhotoFlow
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-foreground/70 transition-colors hover:text-foreground"
          >
            Gallery
          </Link>
          <Link
            href="/admin"
            className="text-foreground/70 transition-colors hover:text-foreground"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
