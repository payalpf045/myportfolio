
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSupabaseClient } from '@/lib/supabase';
import type { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const fileListSchema = z.custom<FileList>().transform(val => val ? Array.from(val) : []);

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().optional(),
  project_type: z.enum(['Photography', 'Film', 'Color Grading']),
  youtube_video_id: z.string().optional(),
  
  cover_image: fileListSchema.refine(files => files.length > 0, {
    message: 'Cover image is required.',
  }).or(z.string()),
  
  before_image: fileListSchema.or(z.string().nullable()),
  after_image: fileListSchema.or(z.string().nullable()),
  
  film_stills: fileListSchema,
}).refine(data => data.project_type !== 'Film' || (data.youtube_video_id && data.youtube_video_id.trim() !== ''), {
  message: 'YouTube Video ID is required for film projects.',
  path: ['youtube_video_id'],
}).refine(data => data.project_type !== 'Color Grading' || !!data.before_image, {
  message: 'Before image is required for color grading.',
  path: ['before_image'],
}).refine(data => data.project_type !== 'Color Grading' || !!data.after_image, {
  message: 'After image is required for color grading.',
  path: ['after_image'],
});

type ProjectFormValues = z.infer<typeof formSchema>;

type ProjectFormProps = {
  onProjectAdded: () => void;
  projectToEdit?: Project | null;
};

export function ProjectForm({ onProjectAdded, projectToEdit }: ProjectFormProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const supabase = createSupabaseClient();
  const { toast } = useToast();

  const isEditing = !!projectToEdit;

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

  useEffect(() => {
    if (projectToEdit) {
      form.reset({
        title: projectToEdit.title,
        description: projectToEdit.description || "",
        project_type: projectToEdit.project_type,
        youtube_video_id: projectToEdit.youtube_video_id || "",
        cover_image: projectToEdit.cover_image_url,
        before_image: projectToEdit.before_image_url,
        after_image: projectToEdit.after_image_url,
        film_stills: [], // Stills are managed separately, not editable in this form
      });
    } else {
        form.reset();
    }
  }, [projectToEdit, form]);

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
        let cover_image_url = projectToEdit?.cover_image_url || '';
        if (values.cover_image instanceof Array && values.cover_image.length > 0) {
            cover_image_url = await uploadFile(values.cover_image[0], 'cover-');
        }
        setProgress(10);
        
        let before_image_url = projectToEdit?.before_image_url || null;
        if (values.before_image instanceof Array && values.before_image.length > 0) {
            before_image_url = await uploadFile(values.before_image[0], 'before-');
        }
        setProgress(20);

        let after_image_url = projectToEdit?.after_image_url || null;
        if (values.after_image instanceof Array && values.after_image.length > 0) {
            after_image_url = await uploadFile(values.after_image[0], 'after-');
        }
        setProgress(30);

        const projectPayload = {
            title: values.title,
            description: values.description,
            project_type: values.project_type,
            cover_image_url,
            youtube_video_id: values.project_type === 'Film' ? values.youtube_video_id : null,
            before_image_url: values.project_type === 'Color Grading' ? before_image_url : null,
            after_image_url: values.project_type === 'Color Grading' ? after_image_url : null,
        };

        if (isEditing) {
            const { error } = await supabase
                .from('projects')
                .update(projectPayload)
                .eq('id', projectToEdit.id);
            if (error) throw new Error(`Database update error: ${error.message}`);
        } else {
            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .insert(projectPayload)
                .select()
                .single();
            if (projectError) throw new Error(`Database insert error: ${projectError.message}`);

             if (values.project_type === 'Film' && values.film_stills.length > 0) {
                const stillUploadPromises = values.film_stills.map(file => uploadFile(file, 'still-'));
                const stillUrls = await Promise.all(stillUploadPromises);
                setProgress(80);

                const stillsToInsert = stillUrls.map(url => ({ project_id: projectData.id, image_url: url }));
                const { error: stillsError } = await supabase.from('project_stills').insert(stillsToInsert);
                if (stillsError) throw new Error(`Stills DB error: ${stillsError.message}`);
            }
        }
        
        setProgress(100);
        toast({ title: "Success!", description: `Project ${isEditing ? 'updated' : 'added'} successfully.` });
        onProjectAdded();

    } catch (error: any) {
      toast({ title: "Operation Failed", description: error.message, variant: "destructive" });
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 1500);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        <FormField
          control={form.control}
          name="project_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={uploading}>
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

        {projectType === 'Film' && !isEditing && (
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
          {uploading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Project')}
        </Button>
      </form>
    </Form>
  );
}
