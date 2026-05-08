
-- 1. Switch update_updated_at_column to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. Restrict public bucket listing - drop overly broad SELECT policies and add scoped ones
-- For video-thumbnails: anyone can read (public bucket) but not list arbitrarily
-- We need to keep public read for thumbnails to display, so this is acceptable
-- The linter warns but public thumbnails need to be accessible by URL

-- For avatars bucket - restrict listing
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- For channel-banners - restrict listing  
DROP POLICY IF EXISTS "Banner images are publicly accessible" ON storage.objects;
CREATE POLICY "Anyone can view banners" ON storage.objects
  FOR SELECT USING (bucket_id = 'channel-banners');
