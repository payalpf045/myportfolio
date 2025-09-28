"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

type Photo = {
  id: string;
  url: string;
  title: string | null;
};

type PhotoCollageProps = {
  photos: Photo[];
};

export function PhotoCollage({ photos }: PhotoCollageProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="break-inside-avoid mb-4 relative"
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={photo.url}
              alt={photo.title || `Photo ${index + 1}`}
              width={500}
              height={500} 
              className="w-full h-auto rounded-md object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="p-0 border-0 max-w-5xl bg-transparent shadow-none">
          {selectedPhoto && (
            <>
              <DialogTitle className="sr-only">{selectedPhoto.title || 'Selected photo'}</DialogTitle>
              <DialogDescription className="sr-only">A larger view of the selected photograph.</DialogDescription>
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.title || 'Selected photo'}
                width={1920}
                height={1080}
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
