import { PhotoGallery } from '@/components/PhotoGallery';

export const revalidate = 0;

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
          Our Gallery
        </h1>
        <p className="text-lg text-foreground/80 mt-2 max-w-2xl mx-auto">
          A collection of our finest moments, captured in time.
        </p>
      </div>
      <PhotoGallery />
    </div>
  );
}
