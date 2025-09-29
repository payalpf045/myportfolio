
import { createSupabaseClient } from '@/lib/supabase';
import type { Project, ProjectStill } from '@/lib/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PhotoCollage } from '@/components/PhotoCollage';

export const revalidate = 0;

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
    // Don't fail the whole page if stills are missing
  }

  return { ...projectData, stills: stillsData || [] };
}

export default async function FilmProjectPage({ params }: FilmProjectPageProps) {
  const project = await getProject(params.id);

  if (!project || !project.youtube_video_id) {
    notFound();
  }

  const stillsForCollage = project.stills.map(still => ({
      id: still.id,
      url: still.image_url,
      title: project.title
  }));

  return (
    <div className="container mx-auto px-4 md:px-6 py-6">
      
      <div className="max-w-4xl mx-auto">
        {/* YouTube Embed */}
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

        <div className="text-center mb-12">
          <h1 className="font-headline text-3xl md:text-4xl text-primary mb-2">
            {project.title}
          </h1>
          {project.description && (
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                  {project.description}
              </p>
          )}
        </div>
      </div>

      {/* Film Stills */}
      {stillsForCollage.length > 0 && (
        <div className="mt-12 md:mt-16">
            <h2 className="font-headline text-2xl md:text-3xl text-center mb-8">Stills</h2>
            <PhotoCollage photos={stillsForCollage} />
        </div>
      )}
    </div>
  );
}
