import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Film } from 'lucide-react';

const projects: any[] = [
  // Projects will be fetched from the database
];


export default function HomePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="font-headline text-5xl md:text-7xl font-bold">
          Visual Storytelling
        </h1>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Your portfolio is currently empty.</p>
            <p className="text-muted-foreground mt-2">Go to the <Link href="/admin" className="underline hover:text-primary">Admin Panel</Link> to start adding projects.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link href={project.href} key={project.id} className="group">
              <Card className="bg-card border-none rounded-lg overflow-hidden h-full flex flex-col">
                <div className="relative aspect-video">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={project.aiHint}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-headline text-2xl font-bold group-hover:underline">
                      {project.title}
                    </h3>
                    {project.type === 'Film' && (
                      <Badge variant="secondary" className="flex items-center gap-1.5 shrink-0">
                        <Film className="h-3 w-3" />
                        <span>Film</span>
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm flex-grow">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
