"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSupabaseClient } from '@/lib/supabase';
import type { Photo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { UploadCloud } from 'lucide-react';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  photo: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Image is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 20MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

type UploadFormProps = {
  onUploadSuccess: (photo: Photo) => void;
}

export function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const supabase = createSupabaseClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        photo: undefined,
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const file = values.photo[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${fileName}`;

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, file);

    clearInterval(progressInterval);

    if (uploadError) {
      setUploading(false);
      setProgress(0);
      toast({
        title: "Upload Failed",
        description: uploadError.message,
        variant: "destructive"
      });
      return;
    }
    
    // Set progress to 100 on successful upload to storage
    setProgress(100);

    const { data: publicUrlData } = supabase.storage
      .from('photos')
      .getPublicUrl(filePath);

    if (!publicUrlData.publicUrl) {
      setUploading(false);
      setProgress(0);
      toast({
        title: "Upload Failed",
        description: "Could not get public URL for the image.",
        variant: "destructive"
      });
      await supabase.storage.from('photos').remove([filePath]);
      return;
    }

    const { data: dbData, error: dbError } = await supabase
      .from('photos')
      .insert({
        image_path: filePath,
        image_url: publicUrlData.publicUrl,
      })
      .select()
      .single();

    if (dbError) {
      setUploading(false);
      setProgress(0);
      toast({
        title: "Database Error",
        description: "Failed to save photo record: " + dbError.message,
        variant: "destructive"
      });
      await supabase.storage.from('photos').remove([filePath]);
      return;
    }

    toast({
        title: "Success!",
        description: "Your photo has been uploaded.",
    });

    onUploadSuccess(dbData as Photo);
    form.reset({photo: undefined});

    setTimeout(() => {
        setUploading(false);
        setProgress(0);
    }, 1000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Photo</CardTitle>
        <CardDescription>Max 20MB. JPG, PNG, WEBP accepted.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <label htmlFor="photo-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary/50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                        <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold text-accent">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground px-2 truncate max-w-full">{field.value?.[0]?.name || 'No file chosen'}</p>
                        </div>
                        <Input
                        id="photo-upload"
                        type="file"
                        className="hidden"
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        onChange={(e) => field.onChange(e.target.files)}
                        disabled={uploading}
                        />
                    </label>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {uploading && (
                <div className="space-y-2 pt-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-muted-foreground text-center">{progress}% uploaded</p>
                </div>
            )}

            <Button type="submit" disabled={uploading} className="w-full bg-accent hover:bg-accent/90">
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
