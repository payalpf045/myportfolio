"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createSupabaseClient } from '@/lib/supabase';
import type { Photo } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseClient();

  useEffect(() => {
    async function fetchPhotos() {
      setLoading(true);
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching photos:', error);
      } else {
        setPhotos(data || []);
      }
      setLoading(false);
    }

    fetchPhotos();

    const channel = supabase
      .channel('photos_gallery_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'photos' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPhotos((prev) => [payload.new as Photo, ...prev]);
          }
          if (payload.eventType === 'DELETE') {
            setPhotos((prev) => prev.filter((p) => p.id !== (payload.old as Photo).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return <p className="text-center text-foreground/70 mt-16 text-lg">The gallery is currently empty. Check back later!</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in duration-500">
      {photos.map((photo) => (
        <div key={photo.id} className="group relative overflow-hidden rounded-lg shadow-md aspect-square">
          <Image
            src={photo.image_url}
            alt="A photo from the gallery"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ))}
    </div>
  );
}
