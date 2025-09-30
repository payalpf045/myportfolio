"use server";
import { createSupabaseClient } from '@/lib/supabase';
import type { Project, ProjectStill } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type FilmProjectPageProps = {
  params: {
    id: string;
  };
};

type ProjectWithStills = Project & {
  stills: ProjectStill[];
};

async function getProject(id: string): Promise<ProjectWithStills | null> {
    const supabase = createSupabaseClient();
      
    const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('project_type', 'Film')
        .single();

    if (projectError || !projectData) {
        console.error('Error fetching project or project not found:', projectError);
        return null;
    }
    
    const { data: stillsData, error: stillsError } = await supabase
        .from('project_stills')
        .select('*')
        .eq('project_id', id);

    if (stillsError) {
        console.error('Error fetching project stills:', stillsError);
    }
    
    return { ...projectData, stills: stillsData || [] };
}


export default async function FilmProjectPage({ params }: FilmProjectPageProps) {
  await params; // Ensure params are resolved
  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  const stillsForCollage = project.stills.map(still => ({
      id: still.id,
      url: still.image_url,
      title: project.title
  }));

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
            <Button variant="ghost" asChild className="text-muted-foreground">
                <Link href="/films">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Films
                </Link>
            </Button>
        </div>
      
      {project.youtube_video_id && (
        <div className="max-w-5xl mx-auto">
            <div className="relative aspect-video mb-12 rounded-lg overflow-hidden border-2 border-muted">
            <iframe
                src={`https://www.youtube.com/embed/${project.youtube_video_id}?rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
            ></iframe>
            </div>
        </div>
      )}

      <div className="text-center mb-12">
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-3">
          {project.title}
        </h1>
        {project.description && (
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
                {project.description}
            </p>
        )}
      </div>

      {stillsForCollage.length > 0 && (
        <div className="mt-16">
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-center mb-8">Stills</h2>
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {stillsForCollage.map((photo) => (
                    <div key={photo.id} className="break-inside-avoid">
                        <Image
                        src={photo.url}
                        alt={photo.title || 'Project Still'}
                        width={500}
                        height={500}
                        className="w-full h-auto rounded-md object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
