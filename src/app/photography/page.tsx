import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon } from 'lucide-react';
import { createSupabaseClient } from '@/lib/supabase';
import type { Project } from '@/lib/types';

export const revalidate = 0; // Revalidate this page on every request

async function getPhotographyProjects() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('project_type', 'Photography')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching photography projects:', error);
    return [];
  }
  return data;
}

export default async function PhotographyPage() {
  const projects = await getPhotographyProjects();

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          Photography
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          A collection of finest moments, captured in time.
        </p>
      </div>

      {projects.length === 0 ? (
         <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No photography projects added yet.</p>
            <p className="text-muted-foreground mt-2">Go to the <Link href="/admin" className="underline hover:text-primary">Admin Panel</Link> to add some.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link href={`/`} key={project.id} className="group">
              <Card className="bg-card border-none rounded-lg overflow-hidden h-full flex flex-col">
                <div className="relative aspect-video">
                  <Image
                    src={project.cover_image_url}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-headline text-2xl font-bold group-hover:underline">
                      {project.title}
                    </h3>
                    <Badge variant="secondary" className="flex items-center gap-1.5 shrink-0">
                      <ImageIcon className="h-3 w-3" />
                      <span>{project.project_type}</span>
                    </Badge>
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
