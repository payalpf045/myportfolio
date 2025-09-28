import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-4rem)] px-4">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/5 blur-[100px]"></div>

        <p className="font-headline text-lg md:text-xl text-muted-foreground mb-4 animate-fade-in-up">
            A Creative Portfolio
        </p>
        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 animate-fade-in-up animation-delay-200">
            John Doe
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground/80 mb-10 animate-fade-in-up animation-delay-400">
            Specializing in creating compelling visual narratives through photography, film, and expert color grading. Explore the portfolio to see the world through a different lens.
        </p>
        <div className="flex gap-4 animate-fade-in-up animation-delay-600">
            <Button asChild size="lg" className="font-bold">
                <Link href="/films">
                    Explore Films <ArrowRight />
                </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-bold">
                <Link href="/photography">
                    View Gallery
                </Link>
            </Button>
        </div>
    </div>
  );
}
