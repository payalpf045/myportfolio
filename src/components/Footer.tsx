import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-16">
      <div className="container mx-auto flex h-20 items-center justify-center px-4 md:px-6">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()}{' '}
          <Link href="/login" className="hover:text-foreground transition-colors">
            PAYAL
          </Link>
          . All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
