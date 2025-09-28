"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSupabaseClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { UploadCloud } from 'lucide-react';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const fileListSchema = z.custom<FileList>().transform(val => val ? Array.from(val) : []);

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().optional(),
  project_type: z.enum(['Photography', 'Film', 'Color Grading']),
  youtube_video_id: z.string().optional(),
  
  cover_image: fileListSchema.refine(files => files.length > 0, 'Cover image is required.'),
  
  before_image: fileListSchema,
  after_image: fileListSchema,
  
  film_stills: fileListSchema,
}).refine(data => data.project_type !== 'Film' || (data.youtube_video_id && data.youtube_video_id.trim() !== ''), {
  message: 'YouTube Video ID is required for film projects.',
  path: ['youtube_video_id'],
}).refine(data => data.project_type !== 'Color Grading' || data.before_image.length > 0, {
  message: 'Before image is required for color grading.',
  path: ['before_image'],
}).refine(data => data.project_type !== 'Color Grading' || data.after_image.length > 0, {
  message: 'After image is required for color grading.',
  path: ['after_image'],
});

type ProjectFormValues = z.infer<typeof formSchema>;

type ProjectFormProps = {
  onProjectAdded: () => void;
};

export function ProjectForm({ onProjectAdded }: ProjectFormProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const supabase = createSupabaseClient();
  const { toast } = useToast();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      project_type: "Photography",
      youtube_video_id: "",
      cover_image: [],
      before_image: [],
      after_image: [],
      film_stills: [],
    },
  });

  const projectType = form.watch('project_type');

  const uploadFile = async (file: File, pathPrefix: string = ''): Promise<string> => {
    const fileName = `${pathPrefix}${Date.now()}-${file.name}`;
    const { error: uploadError, data } = await supabase.storage
      .from('projects')
      .upload(fileName, file);

    if (uploadError) throw new Error(`Storage upload error: ${uploadError.message}`);
    
    const { data: publicUrlData } = supabase.storage
      .from('projects')
      .getPublicUrl(data.path);
      
    if (!publicUrlData.publicUrl) throw new Error("Could not get public URL for the image.");

    return publicUrlData.publicUrl;
  };

  async function onSubmit(values: ProjectFormValues) {
    setUploading(true);
    setProgress(0);

    try {
      const cover_image_url = await uploadFile(values.cover_image[0], 'cover-');
      setProgress(10);

      let before_image_url: string | null = null;
      let after_image_url: string | null = null;
      if (values.project_type === 'Color Grading' && values.before_image[0] && values.after_image[0]) {
        before_image_url = await uploadFile(values.before_image[0], 'before-');
        setProgress(20);
        after_image_url = await uploadFile(values.after_image[0], 'after-');
        setProgress(30);
      }

      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          title: values.title,
          description: values.description,
          project_type: values.project_type,
          cover_image_url,
          youtube_video_id: values.project_type === 'Film' ? values.youtube_video_id : null,
          before_image_url,
          after_image_url,
        })
        .select()
        .single();
      
      if (projectError) throw new Error(`Database error: ${projectError.message}`);
      setProgress(50);
      
      if (values.project_type === 'Film' && values.film_stills.length > 0) {
        const stillUploadPromises = values.film_stills.map(file => uploadFile(file, 'still-'));
        const stillUrls = await Promise.all(stillUploadPromises);
        setProgress(80);

        const stillsToInsert = stillUrls.map(url => ({ project_id: projectData.id, image_url: url }));
        const { error: stillsError } = await supabase.from('project_stills').insert(stillsToInsert);
        if (stillsError) throw new Error(`Stills DB error: ${stillsError.message}`);
      }

      setProgress(100);
      toast({ title: "Success!", description: "Project added successfully." });
      form.reset();
      onProjectAdded();

    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 1500);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="project_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={uploading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Photography">Photography</SelectItem>
                      <SelectItem value="Film">Film</SelectItem>
                      <SelectItem value="Color Grading">Color Grading</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} placeholder="Project Title" disabled={uploading}/></FormControl><FormMessage /></FormItem>
            )}/>
            
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} placeholder="A brief description of the project" disabled={uploading}/></FormControl><FormMessage /></FormItem>
            )}/>

            {projectType === 'Film' && (
              <FormField control={form.control} name="youtube_video_id" render={({ field }) => (
                <FormItem><FormLabel>YouTube Video ID</FormLabel><FormControl><Input {...field} placeholder="e.g. dQw4w9WgXcQ" disabled={uploading}/></FormControl><FormMessage /></FormItem>
              )}/>
            )}

            <FormField control={form.control} name="cover_image" render={({ field: { onChange, ...field } }) => (
                <FormItem><FormLabel>Cover Image</FormLabel><FormControl><Input type="file" accept={ACCEPTED_IMAGE_TYPES.join(",")} onChange={(e) => onChange(e.target.files)} disabled={uploading} /></FormControl><FormMessage /></FormItem>
            )} />

            {projectType === 'Color Grading' && (
              <>
                <FormField control={form.control} name="before_image" render={({ field: { onChange } }) => (
                  <FormItem><FormLabel>Before Image</FormLabel><FormControl><Input type="file" accept={ACCEPTED_IMAGE_TYPES.join(",")} onChange={(e) => onChange(e.target.files)} disabled={uploading} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="after_image" render={({ field: { onChange } }) => (
                  <FormItem><FormLabel>After Image</FormLabel><FormControl><Input type="file" accept={ACCEPTED_IMAGE_TYPES.join(",")} onChange={(e) => onChange(e.target.files)} disabled={uploading} /></FormControl><FormMessage /></FormItem>
                )} />
              </>
            )}

            {projectType === 'Film' && (
              <FormField control={form.control} name="film_stills" render={({ field: { onChange } }) => (
                  <FormItem><FormLabel>Film Stills (Screenshots)</FormLabel><FormControl><Input type="file" multiple accept={ACCEPTED_IMAGE_TYPES.join(",")} onChange={(e) => onChange(e.target.files)} disabled={uploading} /></FormControl><FormMessage /></FormItem>
              )} />
            )}
            
            {uploading && (
                <div className="space-y-2 pt-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-muted-foreground text-center">{progress}% uploaded</p>
                </div>
            )}

            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? 'Adding Project...' : 'Add Project'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
