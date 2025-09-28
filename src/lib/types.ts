export type Project = {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  project_type: 'Photography' | 'Film' | 'Color Grading';
  cover_image_url: string;
  youtube_video_id: string | null;
  before_image_url: string | null;
  after_image_url: string | null;
};

export type ProjectStill = {
  id: string;
  project_id: string;
  image_url: string;
  created_at: string;
};
