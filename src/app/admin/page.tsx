"use client";

import { useState, useEffect, useCallback } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import type { Photo } from '@/lib/types';
import { UploadForm } from '@/components/UploadForm';
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

export default function AdminPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseClient();
  const { toast } = useToast();

  const fetchPhotos = useCallback(async () => {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching photos:', error);
      toast({
        title: "Error",
        description: "Could not fetch photos.",
        variant: "destructive",
      });
    } else {
      setPhotos(data || []);
    }
    setLoading(false);
  }, [supabase, toast]);

  useEffect(() => {
    fetchPhotos();

    const channel = supabase
      .channel('photos_admin_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'photos' },
        (payload) => {
          fetchPhotos(); // Refetch to ensure consistency
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchPhotos]);
  
  const handleDelete = async (photo: Photo) => {
    const { error: storageError } = await supabase.storage
      .from('photos')
      .remove([photo.image_path]);

    if (storageError) {
      console.error('Error deleting from storage:', storageError);
      toast({
        title: "Deletion Error",
        description: `Could not delete image from storage: ${storageError.message}`,
        variant: "destructive",
      });
      return;
    }

    const { error: dbError } = await supabase
      .from('photos')
      .delete()
      .match({ id: photo.id });

    if (dbError) {
      console.error('Error deleting from database:', dbError);
      toast({
        title: "Deletion Error",
        description: `Could not delete image record: ${dbError.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Photo deleted successfully.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="font-headline text-4xl font-bold mb-8">Admin Panel</h1>
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <UploadForm onUploadSuccess={() => {}} />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Manage Photos</CardTitle>
              <CardDescription>View and delete uploaded photos.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="aspect-square w-full rounded-md" />)}
                 </div>
              ) : photos.length === 0 ? (
                <p className="text-center py-10 text-muted-foreground">No photos uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <div className="aspect-square w-full relative overflow-hidden rounded-md border">
                        <Image
                          src={photo.image_url}
                          alt="Uploaded photo"
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </div>
                      <div className="absolute rounded-md inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" aria-label="Delete photo">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the photo.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleDelete(photo)}>Delete</AlertDialogAction>
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
