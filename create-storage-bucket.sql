-- Create storage bucket for profile pictures
-- Run this in your Supabase SQL editor

-- 1. Create the profile-pictures storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create storage policies for the profile-pictures bucket
-- Allow authenticated users to upload their own profile pictures
CREATE POLICY "Users can upload their own profile pictures" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'profile-pictures' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow users to view all profile pictures (public)
CREATE POLICY "Profile pictures are publicly viewable" ON storage.objects
    FOR SELECT USING (bucket_id = 'profile-pictures');

-- Allow users to update their own profile pictures
CREATE POLICY "Users can update their own profile pictures" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'profile-pictures' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow users to delete their own profile pictures
CREATE POLICY "Users can delete their own profile pictures" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'profile-pictures' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Success message
SELECT 'Profile pictures storage bucket created successfully!' as status;

