
-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create storage bucket for channel banners
INSERT INTO storage.buckets (id, name, public) VALUES ('channel-banners', 'channel-banners', true);

-- Avatars: public read
CREATE POLICY "Public avatar access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
-- Avatars: authenticated upload to own folder
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
-- Avatars: users can update own
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
-- Avatars: users can delete own
CREATE POLICY "Users can delete own avatar" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Banners: public read
CREATE POLICY "Public banner access" ON storage.objects FOR SELECT USING (bucket_id = 'channel-banners');
-- Banners: authenticated upload to own folder
CREATE POLICY "Users can upload own banner" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'channel-banners' AND auth.uid()::text = (storage.foldername(name))[1]);
-- Banners: users can update own
CREATE POLICY "Users can update own banner" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'channel-banners' AND auth.uid()::text = (storage.foldername(name))[1]);
-- Banners: users can delete own
CREATE POLICY "Users can delete own banner" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'channel-banners' AND auth.uid()::text = (storage.foldername(name))[1]);
