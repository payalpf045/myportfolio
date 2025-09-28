import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Film } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Midnight Diner',
    description: 'A quiet narrative short about late-night conversations in a city that never sleeps.',
    imageUrl: 'https://picsum.photos/seed/1/600/400',
    aiHint: 'city night',
    type: 'Film',
    href: '/films/midnight-diner'
  },
  {
    id: 2,
    title: 'Coastal Drift',
    description: 'A documentary short capturing the rhythmic life of a small fishing village.',
    imageUrl: 'https://picsum.photos/seed/2/600/400',
    aiHint: 'coast lifeguard',
    type: 'Film',
    href: '/films/coastal-drift'
  },
  {
    id: 3,
    title: 'Forest Anthem',
    description: 'A short film exploring the serene and mystical connection between nature and humanity.',
    imageUrl: 'https://picsum.photos/seed/3/600/400',
    aiHint: 'new york skyline',
    type: 'Film',
    href: '/films/forest-anthem'
  },
  {
    id: 4,
    title: 'City Lights',
    description: 'Exploring the vibrant nightlife of a bustling metropolis.',
    imageUrl: 'https://picsum.photos/seed/4/600/400',
    aiHint: 'london street',
    type: 'Photography',
    href: '/photography/city-lights'
  },
  {
    id: 5,
    title: 'Golden Hour',
    description: 'Capturing the warm, ethereal light of sunset over a rural landscape.',
    imageUrl: 'https://picsum.photos/seed/5/600/400',
    aiHint: 'sunset barn',
    type: 'Photography',
    href: '/photography/golden-hour'
  },
  {
    id: 6,
    title: 'Island Dreams',
    description: 'A visual journey through the stunning landscapes of the Greek isles.',
    imageUrl: 'https://picsum.photos/seed/6/600/400',
    aiHint: 'greece windmill',
    type: 'Photography',
    href: '/photography/island-dreams'
  },
];


export default function HomePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="font-headline text-5xl md:text-7xl font-bold">
          Visual Storytelling
        </h1>
      </div>

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
    </div>
  );
}
