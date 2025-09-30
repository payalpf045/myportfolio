"use server";
import { createSupabaseClient } from '@/lib/supabase';
import type { Project } from '@/lib/types';
import { ImageSlider } from '@/components/ImageSlider';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

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
    
    if (error) {
        console.error('Error fetching project:', error);
        return null;
    }

    return data;
}

export default async function ColorGradingProjectPage({ params }: ColorGradingProjectPageProps) {
  await params; // Ensure params are resolved
  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
       <div className="mb-6">
            <Button variant="ghost" asChild className="text-muted-foreground">
                <Link href="/color-grading">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Color Grading
                </Link>
            </Button>
        </div>
        
        {!project.before_image_url || !project.after_image_url ? (
             <div className="text-center">
                <p className="text-muted-foreground">This project is missing its before/after images.</p>
             </div>
        ) : (
            <>
                <div className="relative mb-8">
                    <div className="absolute top-4 left-4 z-10 bg-black/50 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">Before</div>
                    <div className="absolute top-4 right-4 z-10 bg-black/50 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">After</div>
                    <ImageSlider 
                        beforeImage={project.before_image_url} 
                        afterImage={project.after_image_url} 
                    />
                </div>
            </>
        )}
    </div>
  );
}
