
-- Fix comments FK to point to profiles instead of auth.users
ALTER TABLE public.comments DROP CONSTRAINT comments_user_id_fkey;
ALTER TABLE public.comments
  ADD CONSTRAINT comments_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Check and fix ratings FK too
ALTER TABLE public.ratings DROP CONSTRAINT ratings_user_id_fkey;
ALTER TABLE public.ratings
  ADD CONSTRAINT ratings_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
