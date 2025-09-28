import { PhotoGallery } from '@/components/PhotoGallery';

export const revalidate = 0;

export default function PhotographyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          Photography
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          A collection of finest moments, captured in time.
        </p>
      </div>
      <PhotoGallery />
    </div>
  );
}
