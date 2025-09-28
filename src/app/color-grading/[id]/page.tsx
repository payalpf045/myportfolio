import { createSupabaseClient } from '@/lib/supabase';
import type { Project } from '@/lib/types';
import { notFound } from 'next/navigation';
import { ImageSlider } from '@/components/ImageSlider';

export const revalidate = 0;

type ColorGradingProjectPageProps = {
  params: {
    id: string;
  };
};

async function getProject(id: string): Promise<Project | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('project_type', 'Color Grading')
    .single();

  if (error || !data) {
    console.error('Error fetching project or project not found:', error);
    return null;
  }

  return data;
}

export default async function ColorGradingProjectPage({ params }: ColorGradingProjectPageProps) {
  const project = await getProject(params.id);

  if (!project || !project.before_image_url || !project.after_image_url) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="relative mb-8">
         <div className="absolute top-4 left-4 z-10 bg-black/50 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">Before</div>
         <div className="absolute top-4 right-4 z-10 bg-black/50 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">After</div>
        <ImageSlider 
            beforeImage={project.before_image_url} 
            afterImage={project.after_image_url} 
        />
      </div>

    </div>
  );
}
