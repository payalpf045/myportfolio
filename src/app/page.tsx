
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Film, Image as ImageIcon, Contrast } from 'lucide-react';
import { createSupabaseClient } from '@/lib/supabase';
import type { Project } from '@/lib/types';
import { cn } from '@/lib/utils';

export const revalidate = 0; // Revalidate this page on every request

async function getProjects() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  // Exclude 'Photography' projects from the homepage
  return data.filter(p => p.project_type !== 'Photography');
}

const getProjectLink = (project: Project) => {
    switch(project.project_type) {
        case 'Film':
            return `/films/${project.id}`;
        case 'Color Grading':
            return `/color-grading/${project.id}`;
        case 'Photography':
            return `/photography`;
        default:
            return '/';
    }
}

const ProjectIcon = ({ type }: { type: Project['project_type'] }) => {
    switch (type) {
        case 'Film':
            return <Film className="h-3 w-3" />;
        case 'Color Grading':
            return <Contrast className="h-3 w-3" />;
        // Photography icon won't be used here but kept for consistency
        case 'Photography':
            return <ImageIcon className="h-3 w-3" />;
        default:
            return null;
    }
}


export default async function HomePage() {
  const projects = await getProjects();

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="font-headline text-5xl md:text-6xl animated-gradient-text">
          Visual Storytelling
        </h1>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Your portfolio is currently empty.</p>
            <p className="text-muted-foreground mt-2">Go to the <Link href="/admin" className="underline hover:text-primary">Admin Panel</Link> to add some Film or Color Grading projects.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {projects.map((project, index) => (
            <Link 
              href={getProjectLink(project)} 
              key={project.id} 
              className="group animate-fade-in-up flex flex-col"
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards', opacity: 0 }}
            >
                <div className="relative aspect-video w-full overflow-hidden rounded-md mb-4">
                  <Image
                    src={project.cover_image_url}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="font-headline text-xl md:text-2xl group-hover:text-white/80 transition-colors">
                    {project.title}
                    </h3>
                    <Badge variant="secondary" className="flex items-center gap-1.5 shrink-0 mt-1">
                      <ProjectIcon type={project.project_type} />
                      <span>{project.project_type}</span>
                    </Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                    {project.description}
                </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
