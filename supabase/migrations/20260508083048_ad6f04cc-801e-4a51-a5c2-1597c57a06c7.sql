
-- 1. Fix handle_new_user to not store full email as username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (NEW.id, split_part(NEW.email, '@', 1), split_part(NEW.email, '@', 1));
  
  INSERT INTO public.channels (user_id, name)
  VALUES (NEW.id, split_part(NEW.email, '@', 1) || '''s Channel');
  
  RETURN NEW;
END;
$$;

-- 2. Backfill existing profiles that have emails as usernames
UPDATE public.profiles SET username = split_part(username, '@', 1) WHERE username LIKE '%@%';

-- 3. Fix video-thumbnails storage INSERT policy to add ownership check
DROP POLICY IF EXISTS "Authenticated users can upload thumbnails" ON storage.objects;
CREATE POLICY "Users can upload own thumbnails" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'video-thumbnails'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

-- Add UPDATE policy for thumbnails
CREATE POLICY "Users can update own thumbnails" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'video-thumbnails'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

-- 4. Revoke EXECUTE on handle_new_user from public roles (it's only needed by the trigger)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
