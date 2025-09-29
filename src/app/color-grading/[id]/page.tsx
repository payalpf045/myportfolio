"use client";

import { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import type { Project } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { ImageSlider } from '@/components/ImageSlider';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';


type ColorGradingProjectPageProps = {
  params: {
    id: string;
  };
};

export default function ColorGradingProjectPage({ params }: ColorGradingProjectPageProps) {
  const router = useRouter();
  const { id } = params;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;

      setLoading(true);
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('project_type', 'Color Grading')
        .single();

      if (error || !data) {
        console.error('Error fetching project or project not found:', error);
        setProject(null);
      } else {
        setProject(data);
      }
      setLoading(false);
    }
    
    fetchProject();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 md:px-6 py-12"><Skeleton className="w-full aspect-video" /></div>;
  }
  
  if (!project || !project.before_image_url || !project.after_image_url) {
     return (
        <div className="container mx-auto text-center py-20">
            <h1 className="text-2xl font-bold">Project Not Found</h1>
            <p className="text-muted-foreground mt-2">This color grading project could not be loaded.</p>
            <Button onClick={() => router.push('/color-grading')} className="mt-6">Go to Color Grading</Button>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
       <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Color Grading
            </Button>
        </div>
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
