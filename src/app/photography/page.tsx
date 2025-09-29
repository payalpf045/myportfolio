
import { createSupabaseClient } from '@/lib/supabase';
import { PhotoCollage } from '@/components/PhotoCollage';
import Link from 'next/link';

export const revalidate = 0; // Revalidate this page on every request

type Photo = {
  id: string;
  url: string;
  title: string | null;
};

async function getAllPhotographyPhotos(): Promise<Photo[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('projects')
    .select('id, title, cover_image_url')
    .eq('project_type', 'Photography')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching photography photos:', error);
    return [];
  }

  return data.map(p => ({
    id: p.id,
    url: p.cover_image_url,
    title: p.title
  }));
}


export default async function PhotographyPage() {
  const photos = await getAllPhotographyPhotos();

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
       {photos.length === 0 ? (
         <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No photography projects added yet.</p>
            <p className="text-muted-foreground mt-2">Go to the <Link href="/admin" className="underline hover:text-primary">Admin Panel</Link> to add some.</p>
        </div>
      ) : (
        <PhotoCollage photos={photos} />
      )}
    </div>
  );
}
