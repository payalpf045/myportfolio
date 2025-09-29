
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
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879a.75.75 0 0 0 .925-.365" />
                    <path d="M8 12.5c0 .828-.672 1.5-1.5 1.5S5 13.328 5 12.5s.672-1.5 1.5-1.5S8 11.672 8 12.5z" />
                    <path d="M19 12.5c0 .828-.672 1.5-1.5 1.5S16 13.328 16 12.5s.672-1.5 1.5-1.5S19 11.672 19 12.5z" />
                    <path d="M9.5 16.5s-1-1.5-1-3.5c0-2 1-3.5 1-3.5" />
                    <path d="M14.5 16.5s1-1.5 1-3.5c0-2-1-3.5-1-3.5" />
                </svg>
                <span className="sr-only">Discord</span>
            </a>
        </div>
      </div>
    </footer>
  );
}
