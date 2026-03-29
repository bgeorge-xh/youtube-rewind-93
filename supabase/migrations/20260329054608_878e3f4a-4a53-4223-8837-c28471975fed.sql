
-- Create storage bucket for video thumbnails
INSERT INTO storage.buckets (id, name, public) VALUES ('video-thumbnails', 'video-thumbnails', true);

-- Allow anyone to view thumbnails
CREATE POLICY "Public thumbnail access" ON storage.objects FOR SELECT USING (bucket_id = 'video-thumbnails');

-- Allow authenticated users to upload thumbnails
CREATE POLICY "Authenticated users can upload thumbnails" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'video-thumbnails');

-- Allow users to delete their own thumbnails
CREATE POLICY "Users can delete own thumbnails" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'video-thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);
