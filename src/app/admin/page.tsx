
"use client";

import { useState, useEffect, useCallback } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import type { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectForm } from '@/components/ProjectForm';

// Create the Supabase client once outside the component to prevent re-creation on every render
const supabase = createSupabaseClient();

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Could not fetch projects.",
        variant: "destructive",
      });
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (project: Project) => {
    // Note: Supabase Storage paths need to be extracted from the full URL.
    const getPath = (url: string | null) => url ? new URL(url).pathname.split('/projects/')[1] : null;

    const pathsToDelete: string[] = [];
    if (project.cover_image_url) {
        const path = getPath(project.cover_image_url);
        if(path) pathsToDelete.push(path);
    }
    if (project.before_image_url) {
        const path = getPath(project.before_image_url);
        if(path) pathsToDelete.push(path);
    }
    if (project.after_image_url) {
        const path = getPath(project.after_image_url);
        if(path) pathsToDelete.push(path);
    }
    
    // Stills are managed on the film-specific page, so we don't need to handle them here.
    // Deleting them from this global admin panel could lead to errors if a film project
    // doesn't have stills.
    
    if (pathsToDelete.length > 0) {
        const { error: storageError } = await supabase.storage
        .from('projects')
        .remove(pathsToDelete);

        if (storageError) {
          toast({
            title: "Storage Deletion Error",
            description: `Could not delete project assets: ${storageError.message}`,
            variant: "destructive",
          });
          // Do not return, still try to delete the DB record
        }
    }


    const { error: dbError } = await supabase
      .from('projects')
      .delete()
      .match({ id: project.id });

    if (dbError) {
      toast({
        title: "Database Deletion Error",
        description: `Could not delete project record: ${dbError.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Project deleted successfully.",
      });
      fetchProjects(); // Re-fetch
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="font-headline text-4xl mb-8">Admin Panel</h1>
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProjectForm onProjectAdded={fetchProjects} />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Manage Projects</CardTitle>
              <CardDescription>View and delete your projects.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="aspect-video w-full rounded-md" />)}
                 </div>
              ) : projects.length === 0 ? (
                <p className="text-center py-10 text-muted-foreground">No projects added yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="relative group">
                      <div className="aspect-video w-full relative overflow-hidden rounded-md border">
                        <Image
                          src={project.cover_image_url}
                          alt={project.title || 'Project cover'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="absolute rounded-md inset-0 bg-black/70 p-2 flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-opacity">
                         <p className="font-bold text-sm truncate">{project.title}</p>
                         <p className="text-xs text-white/80">{project.project_type}</p>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" aria-label="Delete project">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the project and all its assets. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleDelete(project)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
