"use client";

import { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import type { Project, ProjectStill } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PhotoCollage } from '@/components/PhotoCollage';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

type FilmProjectPageProps = {
  params: {
    id: string;
  };
};

type ProjectWithStills = Project & {
  stills: ProjectStill[];
};

export default function FilmProjectPage({ params }: FilmProjectPageProps) {
  const router = useRouter();
  const { id } = params;
  const [project, setProject] = useState<ProjectWithStills | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;
      
      setLoading(true);
      const supabase = createSupabaseClient();
      
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('project_type', 'Film')
        .single();

      if (projectError || !projectData) {
        console.error('Error fetching project or project not found:', projectError);
        setProject(null);
      } else {
        const { data: stillsData, error: stillsError } = await supabase
          .from('project_stills')
          .select('*')
          .eq('project_id', id);

        if (stillsError) {
          console.error('Error fetching project stills:', stillsError);
        }
        
        setProject({ ...projectData, stills: stillsData || [] });
      }
      setLoading(false);
    }

    fetchProject();
  }, [id]);

  if (loading) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
            <Skeleton className="relative aspect-video w-full mb-8 rounded-lg" />
            <div className="text-center mb-12">
                <Skeleton className="h-12 w-1/2 mx-auto mb-4" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
            </div>
            <div className="mt-12 md:mt-16">
                 <Skeleton className="h-10 w-1/4 mx-auto mb-8" />
                 <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                    <Skeleton className="h-64 w-full"/>
                    <Skeleton className="h-80 w-full"/>
                    <Skeleton className="h-64 w-full"/>
                    <Skeleton className="h-64 w-full"/>
                    <Skeleton className="h-80 w-full"/>
                    <Skeleton className="h-64 w-full"/>
                 </div>
            </div>
        </div>
    );
  }

  if (!project) {
     return (
        <div className="container mx-auto text-center py-20">
            <h1 className="text-2xl font-bold">Project Not Found</h1>
            <p className="text-muted-foreground mt-2">This film project could not be loaded.</p>
            <Button onClick={() => router.push('/films')} className="mt-6">Go to Films</Button>
        </div>
    );
  }

  const stillsForCollage = project.stills.map(still => ({
      id: still.id,
      url: still.image_url,
      title: project.title
  }));

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Films
            </Button>
        </div>
      
      {project.youtube_video_id && (
        <div className="relative aspect-video mb-8 rounded-lg overflow-hidden border-2 border-muted">
          <iframe
            src={`https://www.youtube.com/embed/${project.youtube_video_id}?rel=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
        </div>
      )}

      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-2">
          {project.title}
        </h1>
        {project.description && (
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                {project.description}
            </p>
        )}
      </div>

      {stillsForCollage.length > 0 && (
        <div className="mt-12 md:mt-16">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-8">Stills</h2>
            <PhotoCollage photos={stillsForCollage} />
        </div>
      )}
    </div>
  );
}
