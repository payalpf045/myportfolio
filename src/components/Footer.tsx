import Link from 'next/link';
import { Mail, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-16">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-6 gap-4">
        <div className="text-center md:text-left">
             <Link href="/" className="flex items-center justify-center md:justify-start gap-3 mb-2" aria-label="Home">
                <span className="text-xl font-bold tracking-wider uppercase font-headline">
                    PAYAL
                </span>
            </Link>
            <p className="text-sm text-muted-foreground">
                <Link href="/login" className="hover:text-foreground transition-colors">
                    &copy;
                </Link>
                {' '}{new Date().getFullYear()}{' '}
                PAYAL. All Rights Reserved.
            </p>
        </div>
        <div className="flex items-center gap-4">
            <a href="mailto:hello@example.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
            </a>
        </div>
      </div>
    </footer>
  );
}
